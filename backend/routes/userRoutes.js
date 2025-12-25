import express from "express";
import UserController from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Protected routes
router.get('/profile/:id', authMiddleware, UserController.getProfile);
router.put('/profile/:id', authMiddleware, UserController.updateProfile);
router.put('/profile/email/:id', authMiddleware, UserController.updateEmail);
router.put('/profile/password/:id', authMiddleware, UserController.updatePassword);
router.delete('/profile/delete/:id', authMiddleware, UserController.deleteUser);
router.post('/logout', authMiddleware, UserController.logout);

export default router;