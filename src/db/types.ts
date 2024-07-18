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

export interface UserSession { 
    valid: boolean;
    username: string | null;
    user_id: number | null;
}

// CREATE TABLE IF NOT EXISTS PlaygroundHistory (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     user_id INTEGER NOT NULL,
//     url TEXT NOT NULL,
//     status TEXT NOT NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
// );

export interface PlaygroundHistoryList {
    id: number,
    url: string;
    status: string;
    created_at: string;
    total_history_records: number;
}