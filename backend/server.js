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


// const cors = require('cors');


// MIDDLEWARES
app.use(express.json({limit: '10mb'})) // allows us to accept JSON data in the req.body]- added limit for larger uploaded images
app.use(express.urlencoded({ extended: true, limit: '10mb'})) 
app.use(firebaseAuth);

// cors configuration
const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://munyun-frontend.onrender.com',
    'https://munyun.netlify.app',
    'https://munyun.pages.dev',
    'https://892c6cfb.munyun.pages.dev'
];
const envOrigins = process.env.FRONTEND_ORIGINS
    ? process.env.FRONTEND_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [];
const allowedOrigins = envOrigins.length ? envOrigins : defaultOrigins;

const corsOptions = { 
    origin: allowedOrigins, // Vite Frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // routes that can cross over
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies or auth headers
 }

app.use(cors(corsOptions));



app.use('/api/expenses', expenseRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/quote', quoteRoutes)
app.use('/api/budgets', budgetRoutes)



// Server
app.listen(PORT, () => {
    connectDB();
    console.log('Server started at http://localhost:' + PORT)
})
