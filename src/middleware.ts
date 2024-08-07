import { defineMiddleware } from "astro:middleware";
import validateSession from "./funcs/validateSession";

export const onRequest = defineMiddleware(async (context, next) => {

    const session = await validateSession(context.request)

    if (session.valid) {
        // @ts-ignore
        context.locals.username = session.username
        return next();
    } else {
        console.log(context.url?.pathname)       
        if (context.url.pathname != "/" && context.url.pathname != "/login" && !context.url.pathname.startsWith("/api/")) {
            return Response.redirect(new URL("/", context.url).toString(), 302)
        }
        return next();
    }
});