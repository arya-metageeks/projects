// server.js
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/signature', (req, res) => {
  try {
    const data = req.body;
    
    // Add timestamp if not provided
    if (!data.timestamp) {
      data.timestamp = Date.now();
    }

    const privateKey = process.env.WERT_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('WERT_PRIVATE_KEY not configured');
    }

    const signature = crypto
      .createHmac('sha256', privateKey)
      .update(JSON.stringify(data))
      .digest('hex');

    res.json({
      signature,
      ...data,
    });
  } catch (error) {
    console.error('Error generating signature:', error);
    res.status(500).json({ 
      error: 'Failed to generate signature'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});