import { defineMiddleware } from "astro:middleware";
import { decryptWithPrivateKey } from "./funcs/encrypt";
import { connectdb } from "./db/connect";

export const onRequest = defineMiddleware(async (context, next) => {

    try {
        // get sessionToken
        const sessionToken = context.request.headers.get('Cookie')?.split(';').find(cookie => cookie.startsWith('sessionToken=') || cookie.startsWith(' sessionToken='))?.split('=')[1] + "=";
        console.log(sessionToken)

        if (sessionToken) {
            // get session from database with matching token
            const decryptedSession = await decryptWithPrivateKey(sessionToken)
            const session = await connectdb().execute({
                sql: `SELECT * FROM Session JOIN User ON Session.user_id = User.id WHERE session_key = ?`,
                args: [decryptedSession]
            })

            console.log(session)

            if (session.rows.length > 0) {
                // @ts-ignore
                context.locals.userid = session.rows[0].user_id; context.locals.username = session.rows[0].username
                return next();

            } else {
                console.log(context.url?.pathname)
                
                if (context.url.pathname != "/" && !context.url.pathname.startsWith("/api/")) {
                    return Response.redirect(new URL("/", context.url).toString(), 302)
                }
            }
        } else {
            if (context.url.pathname != "/" && !context.url.pathname.startsWith("/api/")) {
                return Response.redirect(new URL("/", context.url).toString(), 302)
            }
        }
        return next();

    } catch (error) {
        console.error('Middleware error:', error);
        return Response.redirect(new URL("/", context.url).toString(), 302)
    }
});