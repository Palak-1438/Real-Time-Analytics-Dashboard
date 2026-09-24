const express = require('express');
const http = require('http');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const morgan = require('morgan');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');
const logger = require('./utils/logger');
const { connectDB } = require('./config/db');
const config = require('./config/env');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();
const server = http.createServer(app);

// Trust proxy for correct IP handling behind load balancers
app.set('trust proxy', 1);

// Set HTTP server timeouts
server.setTimeout(config.http.timeout);

// Request Correlation ID Middleware
app.use((req, res, next) => {
    req.id = req.headers['x-request-id'] || uuidv4();
    res.setHeader('x-request-id', req.id);
    next();
});

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "validator.swagger.io"],
        },
    },
}));
app.use(cors({
    origin: config.clientUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id']
}));
app.use(express.json());

const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per `window`
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Morgan logging with correlation ID
morgan.token('id', (req) => req.id);
if (config.env !== 'test') {
    app.use(morgan(':id :method :url :status :res[content-length] - :response-time ms', {
        stream: { write: message => logger.info(message.trim()) }
    }));
}

// API Documentation
app.use('/swagger-ui/index.html', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Only connect to DB if not in test env
if (config.env !== 'test') {
    connectDB();
}

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const indexRoutes = require('./routes/indexRoutes');
app.use('/', indexRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = config.port;

// Set up server to export for socket initialization later
module.exports = { app, server, PORT };
