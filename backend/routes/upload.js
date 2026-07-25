const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// CSV upload works fully for the demo.
// PDF OCR (Tesseract.js / Google Vision) is a stub below -- plug in real OCR later.
router.post('/', auth, upload.single('statement'), async (req, res) => {
  try {
    const filePath = req.file.path;
    let transactions = [];

    if (req.file.mimetype === 'text/csv') {
      const content = fs.readFileSync(filePath, 'utf8');
      const records = parse(content, { columns: true, skip_empty_lines: true });
      transactions = records.map(r => ({
        date: r.date,
        description: r.description,
        amount: parseFloat(r.amount),
        type: parseFloat(r.amount) >= 0 ? 'credit' : 'debit',
        category: r.category || 'uncategorized'
      }));
    } else {
      // TODO (Rishi): hook up Tesseract.js or Google Vision here for PDF statements
      transactions = [
        { date: '2026-07-01', description: 'Sample OCR transaction', amount: -500, type: 'debit', category: 'demo' }
      ];
    }

    const user = await User.findById(req.user.id);
    user.transactions.push(...transactions);
    await user.save();

    fs.unlinkSync(filePath);
    res.json({ msg: 'Statement processed', count: transactions.length, transactions });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;