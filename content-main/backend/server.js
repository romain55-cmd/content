// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
}

const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const db = require('./models');
const { User } = db;
const bcrypt = require('bcryptjs');

const connectDB = require('./config/db');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');
const { scheduleOverdueCheck } = require('./jobs/invoiceJobs');
const { initSubscriptionJobs } = require('./jobs/subscriptionJobs'); // Import subscription jobs

// --- Initializations ---
// Passport config
require('./config/passport')(passport);

// Initialize Express app
const app = express();
app.set('trust proxy', 1); // Trust the first proxy

const createAdminUser = async () => {
  const adminEmail = 'admin@example.com';
  const adminPassword = '123Qwe123!123Qwe123!';
  
  const adminUser = await User.findOne({ where: { email: adminEmail } });

  if (adminUser) {
    // User exists, update password to ensure it's correct
    adminUser.password = adminPassword;
    await adminUser.save();
    console.log('Admin user password updated.');
  } else {
    // User does not exist, create it
    await User.create({
      email: adminEmail,
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'Admin',
      freeGenerationsLeft: 9999,
      has_unlimited_generations: true,
    });
    console.log('Admin user created.');
  }
};


// --- Middleware ---
// Session middleware (required for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Enable CORS
app.use(cors());

// Body parser for JSON
app.use(express.json());

// Logger for requests (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// --- Routes ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Server is running' });
});

// Application-specific routes
app.use('/api/auth', require('./routes/authRoutes')); // Consolidated auth routes
app.use('/api/users', require('./routes/userRoutes')); // User-specific, protected routes
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/promocodes', require('./routes/promoCodeRoutes')); // New promo code routes
app.use('/api/admin', require('./routes/adminRoutes')); // New admin routes

// --- Serve Frontend in Production ---
if (process.env.NODE_ENV === 'production') {
  // Set static folder from 'frontend/dist'
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Handle SPA: for any request that doesn't start with /api, send index.html
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });
}

// --- Error Handling ---
// 404 Not Found handler
app.use(notFound);

// General error handler
app.use(errorHandler);


// --- Server Activation ---
const PORT = 5001;

const startServer = async () => {
  await createAdminUser();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    scheduleOverdueCheck(); // Schedule the overdue check for invoices
    initSubscriptionJobs(); // Initialize subscription expiry job
  });
};

startServer();
