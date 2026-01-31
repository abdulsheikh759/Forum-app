import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import authProtect from '../middlewares/authMiddleware.js';

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Logout route
router.post('/logout', logout);

// Get current user route
router.get("/me", authProtect, getMe);


export default router;