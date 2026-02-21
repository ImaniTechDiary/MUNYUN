import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors';

// ROUTES
import expenseRoutes from './routes/expense.route.js'
import eventRoutes from './routes/event.route.js';
import quoteRoutes from './routes/quote.route.js'
import budgetRoutes from './routes/budget.route.js'
import { firebaseAuth } from './middleware/firebaseAuth.js'


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000
app.set('trust proxy', 1);


// const cors = require('cors');


// cors configuration
const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    // 'https://munyun-frontend.onrender.com',
    // 'https://munyun.netlify.app',
    'https://munyun.pages.dev',
    'https://892c6cfb.munyun.pages.dev'
];
const envOrigins = process.env.FRONTEND_ORIGINS
    ? process.env.FRONTEND_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [];
const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));
const cloudflarePreviewOriginPattern = /^https:\/\/[a-z0-9-]+\.munyun\.pages\.dev$/i;

const corsOptions = { 
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g., curl/postman/server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || cloudflarePreviewOriginPattern.test(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // routes that can cross over
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies or auth headers
    optionsSuccessStatus: 204,
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


// MIDDLEWARES
app.use(express.json({limit: '10mb'})) // allows us to accept JSON data in the req.body]- added limit for larger uploaded images
app.use(express.urlencoded({ extended: true, limit: '10mb'})) 
app.use(firebaseAuth);



app.use('/api/expenses', expenseRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/quote', quoteRoutes)
app.use('/api/budgets', budgetRoutes)

app.get('/', (_req, res) => {
    res.status(200).json({ success: true, message: 'MUNYUN API is running' });
});

app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.use((err, _req, res, _next) => {
    if (err?.message?.startsWith('Not allowed by CORS')) {
        return res.status(403).json({ success: false, message: err.message });
    }
    console.error('Unhandled server error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
});

let server;
const startServer = async () => {
    try {
        await connectDB();
        server = app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

const shutdown = (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    if (!server) {
        process.exit(0);
    }
    server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();
