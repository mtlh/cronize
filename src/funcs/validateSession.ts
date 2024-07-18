import type { UserSession } from "@/db/types";
import { decryptWithPrivateKey } from "./encrypt";
import { connectdb } from "@/db/connect";

export default async function validateSession(request: Request): Promise<UserSession> {
    const sessionToken = request.headers.get('Cookie')?.split(';').find(cookie => cookie.startsWith('sessionToken=') || cookie.startsWith(' sessionToken='))?.split('=')[1] + "=";
    // console.log(sessionToken)

    if (sessionToken) {
        // get session from database with matching token
        const decryptedSession = await decryptWithPrivateKey(sessionToken)
        const session = await connectdb().execute({
            sql: `SELECT User.username, User.id FROM Session JOIN User ON Session.user_id = User.id WHERE session_key = ?`,
            args: [decryptedSession]
        })

        // console.log(session)

        if (session.rows.length > 0) {
            return {
                valid: true,
                username: session.rows[0].username!.toString(),
                user_id: parseInt(session.rows[0].id!.toString())
            }
        } else {
            return {
                valid: false,
                username: null,
                user_id: null
            }
        }
    } else {
        return {
            valid: false,
            username: null,
            user_id: null
        }
    }
}