require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/reports', express.static('reports'));
app.use('/itr-files', express.static('itr-files'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/itr', require('./routes/itr'));

app.get('/', (req, res) => {
    res.send('FinChain AI backend running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
