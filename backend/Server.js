const express = require('express');
const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config({ path: __dirname + '/.env' });

// Set 100MB limit directly if express is required here
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Import Artist Routes
const artistRoutes = require('./routes/artistRoutes');

// Register Artist Routes
app.use('/api/artists', artistRoutes);

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5005;
    app.listen(PORT, () => {
      console.log(`ShowIsHere Server running on port ${PORT}`);
      console.log('---------------------------------------');
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();