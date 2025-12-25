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

// User Model
const UserModel = {
    create: async (email, name, lastname, password) => {
        const sql = `INSERT INTO users (email, name, lastname, password) VALUES (?, ?, ?, ?)`;
        return await runQuery(sql, [email, name, lastname, password]);
    },
    findByEmail: async (email) => {
        const sql = `SELECT * FROM users WHERE email = ?`;
        return await getQuery(sql, [email]);
    },
    findById: async (id) => {
        const sql = `SELECT * FROM users WHERE id = ?`;
        return await getQuery(sql, [id]);
    },
    findAll: async () => {
        const sql = `SELECT id, email, name, lastname, created_at, updated_at FROM users`;
        return await allQuery(sql);
    },
    update: async (id, name, lastname) => {
        const sql = `UPDATE users SET name = ?, lastname = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        return await runQuery(sql, [name, lastname, id]);
    },
    updatePassword: async (id, newPassword) => {
        const sql = `UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        return await runQuery(sql, [newPassword, id]);
    },
    updateEmail: async (id, newEmail) => {
        const sql = `UPDATE users SET email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        return await runQuery(sql, [newEmail, id]);
    },
    delete: async (id) => {
        const sql = `DELETE FROM users WHERE id = ?`;
        return await runQuery(sql, [id]);
    }
};

export default UserModel;