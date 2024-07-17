// Create a new session

import { connectdb } from "../db/connect";
import { generateRandomString } from "../funcs/encrypt";
import { encryptWithPrivateKey } from "../funcs/encrypt";

export default async function createSession(userid: string): Promise<string> {

    const NewSessionKey = generateRandomString(10)
    const EncryptedNewSessionKey = await encryptWithPrivateKey(NewSessionKey)

    await connectdb().execute({
        sql: "INSERT INTO `Session` (session_key, user_id) VALUES (?, ?)",
        args: [NewSessionKey, userid],
    })

    return EncryptedNewSessionKey;
}