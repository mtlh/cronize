import { connectdb } from '@/db/connect';
import validateSession from '@/funcs/validateSession';
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request }) => {

    const validSession = await validateSession(request)

    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id') || '0');

    if (validSession.valid) {
        const projects = await connectdb().execute({
            sql: ` SELECT id, name, description, created_at FROM Project WHERE id = ? AND user_id = ? ORDER BY created_at ASC `,
            args: [id, validSession.user_id]
        })

        if (projects.rows.length === 0) {
            return new Response(JSON.stringify({}), {
                status: 401,
            });
            
        } else {
            return new Response(JSON.stringify(projects.rows[0]), {
                status: 200,
            });
        }

    } else {
        return new Response(JSON.stringify({}), {
            status: 401,
        });
    }
}