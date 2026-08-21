const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Tenant Key Middleware (tenantKeyFunda)
app.use((req, res, next) => {
  const tenantKey = req.headers['x-tenant-key'] || 'default-tenant';
  req.tenantKey = tenantKey;
  next();
});

// Routes
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
  res.send('ShowIsHere API is running...');
});

module.exports = app;