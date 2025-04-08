const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://computer-com.github.io',
    'https://computer-com.github.io/forkify'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
};

// CORS Configuration
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json());

// Content Security Policy Middleware
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https://computer-com.github.io https://forkify-server.onrender.com; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://forkify-server.onrender.com;"
  );
  next();
});

// Serve static files from the React app
const clientBuildPath = path.join(__dirname, 'client/dist');
app.use(express.static(clientBuildPath));

// Security Headers Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://computer-com.github.io');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  res.header('Access-Control-Expose-Headers', 'Authorization');
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('Mongo DB Atlas Connection failed' ,err));

// Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const staffRoutes = require("./routes/staffRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");
const salesRoutes = require("./routes/salesRoutes");
const ledgerRoutes = require("./routes/ledgerRoutes");
const dashboardStatsRoutes = require("./routes/dashboardStatsRoutes");
const menuRoutes = require("./routes/menuRoutes");
const reservationAdminRoutes = require("./routes/reservationAdminRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

// Route Middlewares
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reservation', reservationRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use("/api/stats", dashboardStatsRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/reservations", reservationAdminRoutes);
app.use("/api/settings", settingsRoutes);

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
