require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/reports', express.static('reports'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/tax', require('./routes/tax'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/report', require('./routes/report'));

app.get('/', (req, res) => res.send('FinChain AI backend running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));