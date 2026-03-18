const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Authentication middleware (placeholder)
const authenticate = (req, res, next) => {
    // Check for authentication (token, session, etc.)
    // For demonstration purposes:
    const authToken = req.headers['authorization'];
    if (!authToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // Proceed to next middleware
    next();
};

// Routes
app.get('/api/some-resource', authenticate, (req, res) => {
    res.json({ message: 'This is a secured resource!' });
});

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
