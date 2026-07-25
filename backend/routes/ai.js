const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Plug in a Gemini or OpenAI key in .env. Falls back to a canned
// response if no key is set, so the demo still works offline.
async function callAI(prompt) {
  if (!process.env.OPENAI_API_KEY) {
    return '(Demo mode - no AI key set) Based on your spending, consider reducing discretionary expenses and increasing your 80C investments.';
  }
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }]
    })
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response from AI';
}

router.get('/insights', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const prompt = `Give 3 short spending insights for this transaction data: ${JSON.stringify(user.transactions.slice(-20))}`;
    const insights = await callAI(prompt);
    res.json({ insights });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await callAI(`You are a helpful personal finance assistant. User asked: ${message}`);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;