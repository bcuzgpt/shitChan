// Content moderation middleware
const bannedWords = [
  'slur1', 'slur2', 'slur3', 
  // Add more banned words here
  // This is just a basic example - for production you should use a more comprehensive list
  // or even better, a proper content moderation service
];

// Check post content for banned words and phrases
const moderateContent = (req, res, next) => {
  // Skip if no content to moderate
  if (!req.body) return next();
  
  const fieldsToCheck = ['subject', 'comment', 'content'];
  
  for (const field of fieldsToCheck) {
    if (req.body[field] && typeof req.body[field] === 'string') {
      const content = req.body[field].toLowerCase();
      
      // Check for banned words
      for (const word of bannedWords) {
        if (content.includes(word.toLowerCase())) {
          return res.status(403).json({
            error: 'Post contains banned content'
          });
        }
      }
    }
  }
  
  // If no banned content found, proceed
  next();
};

// Basic spam detection - blocks excessive posting
const spamFilter = (req, res, next) => {
  // This would be more robust with Redis or a proper rate limiting service
  // For now, just using the request IP and a basic in-memory map
  
  const ip = req.ip || req.connection.remoteAddress;
  
  // Get the spam tracking map from the application
  if (!req.app.locals.spamTracking) {
    req.app.locals.spamTracking = new Map();
  }
  
  const now = Date.now();
  const recentPosts = req.app.locals.spamTracking.get(ip) || [];
  
  // Remove posts older than 10 minutes
  const recentValidPosts = recentPosts.filter(time => now - time < 10 * 60 * 1000);
  
  // If too many recent posts, block
  if (recentValidPosts.length >= 5) { // Max 5 posts per 10 minutes
    return res.status(429).json({
      error: 'You are posting too fast. Please wait before posting again.'
    });
  }
  
  // Add current post time and update the map
  recentValidPosts.push(now);
  req.app.locals.spamTracking.set(ip, recentValidPosts);
  
  next();
};

// Validate images to ensure they're within size and type limits
const validateImage = (req, res, next) => {
  // Skip if no file uploaded
  if (!req.file) return next();
  
  // Check file type (already handled by multer but double-checking)
  const allowedTypes = process.env.ALLOWED_FILE_TYPES.split(',');
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      error: 'Invalid file type. Allowed types: ' + allowedTypes.join(', ')
    });
  }
  
  // Check file size (already handled by multer but double-checking)
  const maxSize = parseInt(process.env.MAX_FILE_SIZE);
  if (req.file.size > maxSize) {
    return res.status(400).json({
      error: `File too large. Maximum size: ${Math.round(maxSize / (1024 * 1024))}MB`
    });
  }
  
  next();
};

module.exports = {
  moderateContent,
  spamFilter,
  validateImage
}; 