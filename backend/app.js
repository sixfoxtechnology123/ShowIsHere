const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

app.use(cors());

// INCREASE PAYLOAD LIMIT TO 100MB FOR BASE64 IMAGES
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Tenant Key Middleware (tenantKeyFunda)
app.use((req, res, next) => {
  const tenantKey = req.headers['x-tenant-key'] || 'default-tenant';
  req.tenantKey = tenantKey;
  next();
});

// Routes
app.use('/events', eventRoutes);

app.get('/', (req, res) => {
  res.send('ShowIsHere API is running...');
});

module.exports = app;
