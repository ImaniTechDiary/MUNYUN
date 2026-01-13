import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors';

// ROUTES
import expenseRoutes from './routes/expense.route.js'
import eventRoutes from './routes/event.route.js';
import quoteRoutes from './routes/quote.route.js'


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000


// const cors = require('cors');


// MIDDLEWARES
app.use(express.json({limit: '10mb'})) // allows us to accept JSON data in the req.body]- added limit for larger uploaded images
app.use(express.urlencoded({ extended: true, limit: '10mb'})) 

// cors configuration
const corsOptions = { 
    origin: ['http://localhost:5173'], //Vite Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], //routes that can cross over
    credentials: true, // Allow cookies or auth headers
 }

app.use(cors(corsOptions));



app.use('/api/expenses', expenseRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/quote', quoteRoutes)



// Server
app.listen(PORT, () => {
    connectDB();
    console.log('Server started at http://localhost:' + PORT)
})

