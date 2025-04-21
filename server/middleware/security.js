const { createHash } = require('crypto');

// Sanitize user input
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/[<>]/g, '');
      }
    });
  }
  next();
};

// Validate file upload
const validateFileUpload = (req, res, next) => {
  if (!req.file) return next();
  
  const allowedTypes = process.env.ALLOWED_FILE_TYPES.split(',');
  const maxSize = parseInt(process.env.MAX_FILE_SIZE);
  
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Invalid file type' });
  }
  
  if (req.file.size > maxSize) {
    return res.status(400).json({ error: 'File too large' });
  }
  
  next();
};

// Generate secure filename
const generateSecureFilename = (originalname) => {
  const timestamp = Date.now();
  const hash = createHash('sha256')
    .update(originalname + timestamp)
    .digest('hex')
    .slice(0, 8);
  const ext = originalname.split('.').pop();
  return `${hash}.${ext}`;
};

module.exports = {
  sanitizeInput,
  validateFileUpload,
  generateSecureFilename
}; 