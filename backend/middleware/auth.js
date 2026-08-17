const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.header('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return res.status(401).json({ msg: 'Authentication token is required.' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'development-only-secret');
    return next();
  } catch {
    return res.status(401).json({ msg: 'Invalid or expired authentication token.' });
  }
};
