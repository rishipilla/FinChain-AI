const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { fromPath } = require('pdf2pic');
const Tesseract = require('tesseract.js');

// Points at the English trained-data file bundled by the
// @tesseract.js-data/eng npm package, so OCR works fully offline with no
// runtime download from jsDelivr -- just `npm install` and go.
const TESSDATA_DIR = path.dirname(require.resolve('@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz'));

// Minimum characters we expect from a real text layer before we trust it.
// Below this, we assume the PDF is a scanned image and switch to OCR.
const MIN_TEXT_LENGTH = 30;

// Cap how many pages we OCR per upload, so a huge statement doesn't hang the demo.
const MAX_OCR_PAGES = 5;

/**
 * Try to pull a text layer straight out of the PDF using poppler's pdftotext.
 * This is instant and perfectly accurate for e-statements that were
 * generated as PDFs (not scanned) -- which is most bank/UPI exports.
 */
function extractTextLayer(pdfPath) {
  try {
    // -layout preserves the original physical line layout, which matters
    // for tabular statement data (otherwise pdftotext can reorder columns).
    return execFileSync('pdftotext', ['-layout', pdfPath, '-'], { maxBuffer: 1024 * 1024 * 20 }).toString('utf8');
  } catch (err) {
    return '';
  }
}

/**
 * OCR fallback for scanned/photographed statements with no text layer.
 * Renders each page to a PNG (via pdf2pic, which shells out to
 * GraphicsMagick/poppler) then runs Tesseract on each page image.
 * Uses a locally bundled English model (tessdata/) so it works without
 * any internet access at runtime.
 */
async function extractTextViaOCR(pdfPath) {
  const tmpDir = fs.mkdtempSync('/tmp/ocr-');
  const converter = fromPath(pdfPath, {
    density: 200,
    saveFilename: 'page',
    savePath: tmpDir,
    format: 'png',
    width: 1600,
    height: 2000
  });

  const worker = await Tesseract.createWorker('eng', 1, {
    langPath: TESSDATA_DIR,
    cachePath: TESSDATA_DIR,
    gzip: true
  });

  let fullText = '';
  try {
    for (let page = 1; page <= MAX_OCR_PAGES; page++) {
      let result;
      try {
        result = await converter(page, { responseType: 'image' });
      } catch (err) {
        break; // no more pages
      }
      const { data } = await worker.recognize(result.path);
      fullText += data.text + '\n';
    }
  } finally {
    await worker.terminate();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  return fullText;
}

/**
 * Main entry point: get the best available text out of a PDF statement.
 * Tries the fast text-layer route first, only OCRs if that comes up empty.
 */
async function extractTextFromPDF(pdfPath) {
  const textLayer = extractTextLayer(pdfPath);
  if (textLayer.trim().length >= MIN_TEXT_LENGTH) {
    return { text: textLayer, method: 'text-layer' };
  }
  const ocrText = await extractTextViaOCR(pdfPath);
  return { text: ocrText, method: 'ocr' };
}

/**
 * Turn raw statement text into transaction objects.
 * Matches lines like:
 *   01/07/2026  Salary Credit  50000.00  CR
 *   03/07/2026  Grocery Store Purchase  -1200.50  DR
 * This covers common simple export formats; real-world statements vary a
 * lot, so tune this regex to match whichever bank/UPI export you're using.
 */
function parseTransactionsFromText(text) {
  const lines = text.split('\n');
  const lineRegex = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s+(.+?)\s+(-?[\d,]+\.\d{2})\s*(CR|DR|credit|debit)?\s*$/i;

  const transactions = [];
  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+/g, ' ').trim();
    const match = line.match(lineRegex);
    if (!match) continue;

    const [, date, description, amountStr, typeHint] = match;
    let amount = parseFloat(amountStr.replace(/,/g, ''));
    let type;

    if (typeHint && /dr|debit/i.test(typeHint)) {
      type = 'debit';
      amount = -Math.abs(amount);
    } else if (typeHint && /cr|credit/i.test(typeHint)) {
      type = 'credit';
      amount = Math.abs(amount);
    } else {
      type = amount < 0 ? 'debit' : 'credit';
    }

    transactions.push({
      date,
      description: description.trim(),
      amount,
      type,
      category: 'uncategorized'
    });
  }
  return transactions;
}

module.exports = { extractTextFromPDF, parseTransactionsFromText };
