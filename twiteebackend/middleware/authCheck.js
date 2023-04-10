// Import dependencies
const jwt = require('jsonwebtoken');

// Middleware function to check authentication
const authCheck = (req, res, next) => {
  // Get the JWT from the request header
  const token = req.header('Authorization');

  // Check if the JWT exists
  if (!token) {
    res.redirect('127.0.0.1:3000/');
    return res.status(401).json({ message: 'Authorization denied. Token is not provided.' });
  }

  try {
    // Verify the JWT
     console.log(token)
    const decoded = jwt.verify(token, 'secret');
    
    // Add the user object to the request object
    req.user = decoded.userId;
  
    // Call the next middleware
    next();
  } catch (err) {
    // Handle errors
    // res.redirect('localhost:3000/');
    return res.status(402).json({ message: 'Authorization denied. Token is not valid.' });
  }
};

module.exports = authCheck;
