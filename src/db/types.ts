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

// CREATE TABLE IF NOT EXISTS Project (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     user_id INTEGER NOT NULL,
//     name TEXT NOT NULL,
//     description TEXT NOT NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
// );

export interface Project {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

// CREATE TABLE IF NOT EXISTS Cronjob (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     project_id INTEGER NOT NULL,
//     url TEXT NOT NULL,
//     name TEXT NOT NULL,
//     request_type TEXT NOT NULL,
//     request_headers TEXT ,
//     request_body TEXT,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     interval TEXT NOT NULL,
//     daily_time TEXT NOT NULL,
//     last_run_time DATETIME,
//     last_run_status TEXT,
//     FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE
// );


export interface Cronjob {
    id: number;
    project_id: number;
    request_type: string;
    request_headers?: string;
    request_body?: string;
    url: string;
    name: string;
    created_at: string;
    updated_at: string;
    interval: string;
    daily_time: string;
    last_run_time: string;
    last_run_status: string;
}

// CREATE TABLE IF NOT EXISTS CronjobHistory (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     cronjob_id INTEGER NOT NULL,
//     status TEXT NOT NULL,
//     ran_time DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (cronjob_id) REFERENCES Cronjob(id) ON DELETE CASCADE
// );

export interface CronjobHistory {
    id: number;
    cronjob_id: number;
    status: string;
    ran_time: string;
}

// CREATE TRIGGER update_cronjob_last_run
// AFTER INSERT ON CronjobHistory
// FOR EACH ROW
// BEGIN
//     UPDATE Cronjob
//     SET last_run_time = NEW.ran_time, last_run_status = NEW.status
//     WHERE id = NEW.cronjob_id;
// END;

export type ProjectInfo = {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    cronjobs: Cronjob[];
}

// CREATE TABLE IF NOT EXISTS CronjobExecutionQueue (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     cronjob_id INTEGER NOT NULL,
//     FOREIGN KEY (cronjob_id) REFERENCES Cronjob(id) ON DELETE CASCADE
// );

export interface CronjobExecutionQueue {
    id: number;
    cronjob_id: number;
}