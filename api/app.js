const express = require('express');
const mongoose = require('mongoose');
const { urlDb } = require('../config');
const app = express();

app.use(express.json());

const threadsSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: 600,
  },
  hashTags: [
    {
      type: String,
      maxlength: 50,
    },
  ],
}, { timestamps: true });

const Threads = mongoose.model('Threads', threadsSchema);

// Connect to MongoDB
mongoose
  .connect(urlDb)
  .then(() => console.log('MongoDB Connected'))
  .catch((error) => console.log(error));

// Create Threads
app.post('/api/create-threads', async (req, res) => {
  try {
    const { content, hashTags } = req.body;
    const newThread = await Threads.create({ content, hashTags });
    res.status(201).json(newThread);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Threads
app.get('/api/threads', async (req, res) => {
  try {
    const result = await Threads.find();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error getting threads:', error);
    res.status(400).json({ error: error.message });
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
