const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();

// Security / Proxy Settings
app.set('trust proxy', true);

// Enable CORS
app.use(cors());

// 100MB Payload Limit for Base64 Images
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Tenant Key Middleware
app.use((req, res, next) => {
  const tenantKey = req.headers['x-tenant-key'] || 'default-tenant';
  req.tenantKey = tenantKey;
  next();
});

// Import Routes
const artistRoutes = require('./routes/artistRoutes');
const eventOrgAccountRoutes = require('./routes/eventOrgAccountRoutes');
const eventCategoryRoutes = require('./routes/eventCategoryRoutes');
const categoryMasterRoutes = require('./routes/categoryMasterRoutes');
const questionDatabaseRoutes = require('./routes/questionDatabaseRoutes');
const eventQuestionRoutes = require('./routes/EventQuestionRoutes');
const loginRoutes = require('./routes/loginRoutes');
const eventRoutes = require('./routes/createEventRoutes');
const seatMapRoutes = require('./routes/seatMapRoutes');

// Base Health Check
app.get('/', (req, res) => {
  res.send('ShowIsHere API is running...');
});

// Register Routes
app.use('/events', eventRoutes);
app.use('/artists', artistRoutes);
app.use('/org', eventOrgAccountRoutes);
app.use('/event-categories', eventCategoryRoutes);
app.use('/categories', categoryMasterRoutes);
app.use('/question-database', questionDatabaseRoutes);
app.use('/event-questions', eventQuestionRoutes);
app.use('/login-page', loginRoutes);

// Server Initialization
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