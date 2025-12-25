import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create/connect to the database
export const db = new sqlite3.Database(
    join(__dirname, "../database.db"),
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (error) => {
        if (error) {
            console.error("Error connecting to the database:", error);
        } else {
            console.log("Database connected successfully");
        }
    }
);

// Enable foreign keys to keep referencial integrity
db.run('PRAGMA foreign_keys = ON');

// Create tables
const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    lastname TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

const createNotesTable = `CREATE TABLE IF NOT EXISTS notes (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    subject TEXT,
    cue_text TEXT,
    note_text TEXT,
    summary_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)`;

db.serialize(() => {
    db.run(createUsersTable, (error) => {
        if (error) {
            console.log("Error creating table users:", error)
        } else {
            console.log("Table user connected successfully")
        }
    });

    db.run(createNotesTable, (error) => {
        if (error) {
            console.log("Error creating notes table:", error)
        } else {
            console.log("Notes table connected successfully")
        }
    });
});
