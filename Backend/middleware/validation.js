const { body, validationResult } = require('express-validator');

// Validation middleware for AI requests
const validateAIRequest = [
  body('question')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Question must be between 1 and 1000 characters')
    .trim()
    .escape(),
  
  body('userId')
    .optional()
    .isString()
    .trim(),
    
  body('childInfo')
    .optional()
    .isObject()
    .withMessage('childInfo must be an object'),
    
  body('childInfo.age')
    .optional()
    .isInt({ min: 0, max: 18 })
    .withMessage('Age must be between 0 and 18'),
    
  body('childInfo.gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  
  // Check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid input', 
        details: errors.array() 
      });
    }
    next();
  }
];

module.exports = { validateAIRequest };
