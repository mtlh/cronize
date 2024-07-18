import { connectdb } from '@/db/connect';
import validateSession from '@/funcs/validateSession';
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request }) => {

    const validSession = await validateSession(request)

    // get page param
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');

    if (validSession.valid) {
        const history = await connectdb().execute({
            sql: `
            SELECT 
                ph.url,
                ph.id,
                ph.status, 
                ph.created_at, 
                COUNT(*) OVER() AS total_history_records
            FROM 
                playgroundHistory ph
            WHERE 
                ph.user_id = ?
            ORDER BY 
                ph.created_at DESC
            LIMIT 10 OFFSET ?;
            `,
            args: [validSession.user_id, (page - 1) * 10]
        })

        for (const row of history.rows) {
            const timestamp = row.created_at;
            if (typeof timestamp === 'string' || typeof timestamp === 'number' || timestamp instanceof Date) {
                row.created_at = new Date(timestamp).toLocaleString();
            } else if (typeof timestamp === 'bigint') {
                row.created_at = new Date(Number(timestamp)).toLocaleString();
            } else {
                row.created_at = 'Invalid date';
            }
        }
        
        return new Response(JSON.stringify(history.rows), {
            status: 200,
        });

    } else {
        return new Response(JSON.stringify({}), {
            status: 200,
        });
    }
}