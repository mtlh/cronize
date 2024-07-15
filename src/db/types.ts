// CREATE TABLE IF NOT EXISTS `User` (
//   `id` int(11) NOT NULL AUTO_INCREMENT,
//   `username` varchar(255) NOT NULL,
//   `password` varchar(255) NOT NULL,
//   `email` varchar(255) NOT NULL,
//   `role` varchar(255) NOT NULL DEFAULT 'user',
//   `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

export interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

// CREATE TABLE IF NOT EXISTS `Session` (
//   `id` int(11) NOT NULL AUTO_INCREMENT,
//   `user_id` int(11) NOT NULL,
//   `session_key` varchar(255) NOT NULL,
//   `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   PRIMARY KEY (`id`),
//   KEY `user_id` (`user_id`),
//   CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

export interface Session {
    id: number;
    userId: number;
    sessionKey: string;
    createdAt: string;
    updatedAt: string;
}