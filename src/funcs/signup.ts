import { connectdb } from "@/db/connect"
import { encrypt } from "./encrypt"

export default async function signupProcess( email: string, password: string, username: string): Promise<string[]> {

    // does email exist in database?
    const isEmail = await connectdb().execute({
        sql: `SELECT * FROM User WHERE email = ?`,
        args: [email]
    })
    if (isEmail.rows.length > 0) {
        return ["0", "email exists"]
    }

    // encrypt password
    const newPass = await encrypt(password)
    // insert user into database
    const insertUser = await connectdb().execute({
        sql: `INSERT INTO User (email, password, username) VALUES (?, ?, ?)`,
        args: [email, newPass, username]
    })

    return [insertUser.lastInsertRowid!.toString(), "complete"]
}