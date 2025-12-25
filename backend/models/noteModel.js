import { db } from "../config/database.js";

// Helper functions to use promises with sqlite3
const runQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (error) {
            if (error) reject(error);
            else resolve(this);
        });
    });
};

const getQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (error, row) => {
            if (error) reject(error);
            else resolve(row);
        });
    });
};

const allQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (error, rows) => {
            if (error) reject(error);
            else resolve(rows);
        });
    });
};

// Note Model
const NoteModel = {
    // Create a new note
    create: async (user_id, title, subject, cue_text, note_text, summary_text) => {
        const sql = `INSERT INTO notes (user_id, title, subject, cue_text, note_text, summary_text) VALUES (?, ?, ?, ?, ?, ?)`;
        return await runQuery(sql, [user_id, title, subject, cue_text, note_text, summary_text]);
    },
    // Find all notes of an specific user
    findAllByUserId: async (user_id) => {
        const sql = `SELECT * FROM notes WHERE user_id = ?`;
        return await allQuery(sql, [user_id]);
    },
    // Find a specific note
    findById: async (id) => {
        const sql = `SELECT * FROM notes WHERE id = ?`;
        return await getQuery(sql, [id]);
    },
    // Verify if a note belongs to a user
    findByIdAndUser: async (id, user_id) => {
        const sql = `SELECT * FROM notes WHERE id = ? AND user_id = ?`;
        return await getQuery(sql, [id, user_id]);
    },
    // Update a note
    update: async (id, title, subject, cue_text, note_text, summary_text) => {
        const sql = `UPDATE notes
                    SET title = ?, subject = ?, cue_text = ?, note_text = ?, summary_text = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?`;
        return await runQuery(sql, [title, subject, cue_text, note_text, summary_text, id]);
    },
    // Delete a note
    delete: async (id) => {
        const sql = `DELETE FROM notes WHERE id = ?`;
        return await runQuery(sql, [id]);
    },
    findAll: async () => {
        const sql = `SELECT * FROM notes`;
        return await allQuery(sql);
    }
};

export default NoteModel;
