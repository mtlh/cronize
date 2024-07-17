// CREATE TABLE IF NOT EXISTS User (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     username TEXT NOT NULL,
//     password TEXT NOT NULL,
//     email TEXT NOT NULL,
//     role TEXT NOT NULL DEFAULT 'user',
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
// );  

export interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
}

// CREATE TABLE IF NOT EXISTS Session (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     user_id INTEGER NOT NULL,
//     session_key TEXT NOT NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
// );

export interface Session {
    id: number;
    user_id: number;
    session_key: string;
    created_at: string;
    updated_at: string;
}