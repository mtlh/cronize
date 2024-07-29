import { connectdb } from '@/db/connect';
import validateSession from '@/funcs/validateSession';
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request }) => {

    const validSession = await validateSession(request)

    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id') || '0');

    if (validSession.valid) {
        const projects = await connectdb().execute({
            sql: `
                SELECT 
                    c.id, 
                    c.project_id, 
                    c.name,
                    c.request_type,
                    c.request_headers,
                    c.request_body,
                    c.url,
                    c.created_at, 
                    c.updated_at, 
                    c.interval, 
                    c.daily_time, 
                    c.last_run_time, 
                    c.last_run_status 
                FROM 
                    Cronjob c
                JOIN 
                    Project p ON c.project_id = p.id
                WHERE 
                    p.user_id = ? AND c.id = ?
                LIMIT 1;
            `,
            args: [validSession.user_id, id]
        })

        if (projects.rows.length > 0) {

            // get cronjob history
            const history = await connectdb().execute({
                sql: ` SELECT * FROM CronjobHistory WHERE cronjob_id = ? ORDER BY ran_time DESC LIMIT 10 `,
                args: [id]
            })
            return new Response(JSON.stringify({cron: projects.rows[0], history: history.rows}), {
                status: 200,
            });
        } else {
            return new Response(JSON.stringify({}), {
                status: 200,
            });
        }

    } else {
        return new Response(JSON.stringify({}), {
            status: 200,
        });
    }
}