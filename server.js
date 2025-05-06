const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/ping', (req,res) => {
    res.json({message: 'pong'});
});

app.listen(PORT, () => {
    console.log(`Server runnign on http://localhost:${PORT}`);
});