const express = require('express');
const PDFDocument = require('pdfkit');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

router.get('/generate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const reportsDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);
    const filePath = path.join(reportsDir, `report_${user._id}.pdf`);

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text('FinChain AI -- Financial Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Generated: ${new Date().toLocaleString()}`);
    doc.moveDown();
    doc.text(`Total transactions: ${user.transactions.length}`);
    doc.end();

    stream.on('finish', () => {
      const fileBuffer = fs.readFileSync(filePath);
      const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

      // Manogya: call the smart contract's storeHash(hash) here, e.g.
      // await contract.storeHash(hash);

      res.json({ msg: 'Report generated', filePath: `/reports/report_${user._id}.pdf`, hash });
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;