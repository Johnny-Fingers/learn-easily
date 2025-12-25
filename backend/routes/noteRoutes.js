import express from "express";
import NoteController from "../controllers/noteController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
// Apply auth middleware to all routes
router.use(authMiddleware);

// Note routes
router.post('/new', NoteController.createNote);
router.get('/', NoteController.getUserNotes);
router.get('/:id', NoteController.getNote);
router.put('/:id', NoteController.updateNote);
router.delete('/:id', NoteController.deleteNote);

export default router;