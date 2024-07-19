import { connectdb } from '@/db/connect';
import validateSession from '@/funcs/validateSession';
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request }) => {

    const validSession = await validateSession(request)

    if (validSession.valid) {
        const projects = await connectdb().execute({
            sql: ` SELECT id, name FROM Project WHERE user_id = ? ORDER BY created_at ASC `,
            args: [validSession.user_id]
        })
        
        return new Response(JSON.stringify(projects.rows), {
            status: 200,
        });

    } else {
        return new Response(JSON.stringify({}), {
            status: 200,
        });
    }
}