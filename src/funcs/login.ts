import { connectdb } from "@/db/connect"
import { decryptWithPrivateKey } from "./encrypt"

export default async function loginProcess( email: string, password: string): Promise<string[]> {

    // does email exist in database?
    const isEmail = await connectdb().execute({
        sql: `SELECT * FROM User WHERE email = ?`,
        args: [email]
    })

    console.log(isEmail)

    if (isEmail.rows.length === 0) {
        return ["0", "email does not exist"]
    }

    // check password against database record
    const dbPass = await decryptWithPrivateKey(isEmail.rows[0].password!.toString())

    if (dbPass !== password) {
        return ["0", "incorrect password"]
    } else {
        return ["1", "success"]
    }
}