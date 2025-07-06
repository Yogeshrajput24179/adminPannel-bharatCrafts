const mongoose = require('mongoose');

require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MongoDB URI is missing. Check your .env file.");
  process.exit(1);
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
module.exports = mongoose;