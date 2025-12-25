import NoteModel from "../models/noteModel.js";

const NoteController = {
    // CREATE NOTE
    createNote: async (req, res) => {
        try {
            const user_id = req.user.userId;
            const { title, subject, cue_text, note_text, summary_text } = req.body;

            if (!title) {
                return res.status(400).json({
                    error: 'Title is required'
                });
            }

            const createdNote = await NoteModel.create(
                user_id,
                title,
                subject || null,
                cue_text || null,
                note_text || null,
                summary_text || null
            );
            res.status(201).json({
                message: 'Note created successfully',
                noteId: createdNote.lastID
            });
        } catch (error) {
            console.error('Create note error: ', error);
            res.status(500).json({
                error: 'Failed to create note'
            });
        }
    },

    // GET ALL USER NOTES
    getUserNotes: async (req, res) => {
        try {
            const userId = req.user.userId;
            const notes = await NoteModel.findAllByUserId(userId);
            res.status(200).json({
                count: notes.length,
                notes: notes
            });
        } catch (error) {
            console.error('Get user notes error: ', error);
            res.status(500).json({
                error: 'Failed to get user notes'
            });
        }
    },

    // GET A SINGLE NOTE
    getNote: async (req, res) => {
        try {
            const noteId = req.params.id;
            const userId = req.user.userId;

            const note = await NoteModel.findByIdAndUser(noteId, userId);
            if (!note) {
                return res.status(404).json({
                    error: 'Note not found'
                });
            }
            res.status(200).json(note);
        } catch (error) {
            console.error('Get note error: ', error);
            res.status(500).json({
                error: 'Error fetching note'
            });
        }
    },

    // UPDATE A NOTE
    updateNote: async (req, res) => {
        try {
            const noteId = req.params.id;
            const userId = req.user.userId;
            const { title, subject, cue_text, note_text, summary_text } = req.body;

            const existingNote = await NoteModel.findByIdAndUser(noteId, userId);
            if (!existingNote) {
                return res.status(404).json({
                    error: 'Note not found'
                });
            }

            if (!title) {
                return res.status(400).json({
                    error: 'Title is required'
                });
            }

            await NoteModel.update(
                noteId,
                title,
                subject || existingNote.subject,
                cue_text || existingNote.cue_text,
                note_text || existingNote.note_text,
                summary_text || existingNote.summary_text
            );
            res.status(200).json({
                message: 'Note updated successfully'
            });
        } catch (error) {
            console.error('Update note error: ', error);
            res.status(500).json({
                error: 'Error updating note'
            });
        }
    },

    // DELETE NOTE
    deleteNote: async (req, res) => {
        try {
            const noteId = req.params.id;
            const userId = req.user.userId;

            const existingNote = await NoteModel.findByIdAndUser(noteId, userId);
            if (!existingNote) {
                return res.status(404).json({
                    error: 'Note not found'
                });
            }

            await NoteModel.delete(noteId);
            res.json({
                message: 'Note deleted successfully'
            });
        } catch (error) {
            console.error('Delete note error: ', error);
            res.status(500).json({
                error: 'Error deleting note'
            });
        }
    }
};

export default NoteController;