import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

dotenv.config();
// Initialize express app
const app = express();
// Set port using dotenv
const PORT = process.env.PORT || 3000;
// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // React dev server
    credentials: true // Allow credentials
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Root Route
app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the learn easily app',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            notes: '/api/notes'
        }
    });
});

app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Page not found'
    });
});
// Error handler
app.use((error, req, res, next) => {
    console.error('Error', error);
    res.status(500).json({
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`📝 API Endpoints:`);
    console.log(`   - Users: http://localhost:${PORT}/api/users`);
    console.log(`   - Notes: http://localhost:${PORT}/api/notes`);
});