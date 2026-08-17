const express = require('express');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const User = require('../models/user');
const { calcOldRegime, calcNewRegime } = require('../utils/taxCalc');
const { buildITR1 } = require('../utils/itrSchema');
const router = express.Router();

router.post('/profile', auth, async (req, res) => {
  try {
    const { pan, dob, fatherName, address, bankAccount, assessmentYear } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          itrProfile: {
            pan,
            dob,
            fatherName,
            address,
            bankAccount,
            assessmentYear,
          },
        },
      },
      { new: true }
    );

    res.json({ msg: 'ITR profile saved', itrProfile: user.itrProfile });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post('/generate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const p = user.itrProfile || {};
    if (!p.pan || !p.dob || !p.bankAccount?.accountNo || !p.bankAccount?.ifsc) {
      return res.status(400).json({
        msg: 'Missing required ITR profile fields (PAN, DOB, bank account, IFSC). POST /api/itr/profile first.',
      });
    }

    const income = Number(user.annualIncome) || 0;
    const deductions = Number(user.investments80C) || 0;
    const oldRegimeTax = calcOldRegime(income, deductions,0,0);
    const newRegimeTax = calcNewRegime(income);
    const taxResult = {
      oldRegimeTax,
      newRegimeTax,
      recommended: oldRegimeTax <= newRegimeTax ? 'old' : 'new',
      savings: Math.abs(oldRegimeTax - newRegimeTax),
    };

    const itrJson = buildITR1(user, taxResult);
    const itrDir = path.join(__dirname, '../itr-files');
    if (!fs.existsSync(itrDir)) fs.mkdirSync(itrDir, { recursive: true });

    const fileName = `ITR1_${user._id}_${(p.assessmentYear || 'AY').replace('/', '-')}.json`;
    const fullPath = path.join(itrDir, fileName);
    fs.writeFileSync(fullPath, JSON.stringify(itrJson, null, 2));

    res.json({
      msg: 'ITR pre-fill JSON generated. This is not a filed return -- download it and review it on the official portal before submitting.',
      downloadPath: `/itr-files/${fileName}`,
      portalUrl: 'https://www.incometax.gov.in/iec/foservices/#/login',
      taxSummary: taxResult,
      itrJson,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
