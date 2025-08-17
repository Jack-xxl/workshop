const rateLimit = require('express-rate-limit');

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 // 15 minutes in seconds
  },
  standardHeaders: true, // Include rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
});

// Stricter rate limiting for AI endpoint
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 AI requests per minute
  message: {
    error: 'Too many AI requests, please wait before asking another question.',
    retryAfter: 60 // 1 minute in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter, aiLimiter };
