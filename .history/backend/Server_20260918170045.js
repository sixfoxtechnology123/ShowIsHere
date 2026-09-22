const express = require('express');
const connectDB = require('./config/db');
const app = express();
require('dotenv').config({ path: __dirname + '/.env' });
app.set('trust proxy', true);
// Set 100MB limit directly if express is required here
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Import Artist Routes
const artistRoutes = require('./routes/artistRoutes');
const eventOrgAccountRoutes = require('./routes/eventOrgAccountRoutes');
const eventCategoryRoutes = require('./routes/eventCategoryRoutes');
const categoryMasterRoutes = require('./routes/categoryMasterRoutes');
const questionDatabaseRoutes = require('./routes/questionDatabaseRoutes');
const eventQuestionRoutes = require('./routes/EventQuestionRoutes');
const loginRoutes = require('./routes/loginRoutes');
const createEventRoutes =require('./routes/createEventRoutes');

// Register Artist Routes
app.use('/artists', artistRoutes);
app.use('/org', eventOrgAccountRoutes);
app.use('/event-categories', eventCategoryRoutes);
app.use('/categories', categoryMasterRoutes);
app.use('/question-database', questionDatabaseRoutes);
app.use('/event-questions', eventQuestionRoutes);
app.use('/login-page', loginRoutes);

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
