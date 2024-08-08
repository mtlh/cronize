import { connectdb } from '@/db/connect';
import validateSession from '@/funcs/validateSession';
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request }) => {

    const validSession = await validateSession(request)

    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id') || '0');
    const active = parseInt(url.searchParams.get('active') || '0');

    if (validSession.valid) {

        // update active as long as project_id is owned by the user id
        // console.log(active, id, validSession.user_id)
        const activeResult = await connectdb().execute({
            sql: `
                UPDATE Cronjob
                SET active = ?
                WHERE id = ? AND project_id IN (
                    SELECT p.id FROM Project p WHERE p.user_id = ?
                );
            `,
            args: [active, id, validSession.user_id]
        })

        if (activeResult.rowsAffected > 0) {
            return new Response(JSON.stringify(active), {
                status: 200,
            });
        } else {
            return new Response(JSON.stringify({}), {
                status: 400,
            });
        }

    } else {
        return new Response(JSON.stringify({}), {
            status: 400,
        });
    }
}