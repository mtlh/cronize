import { connectdb } from '@/db/connect';
import validateSession from '@/funcs/validateSession';
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request }) => {

    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id') || '0');

    const validSession = await validateSession(request)

    if (validSession.valid && id) {

        // check if user owns the cron
        const cron = await connectdb().execute({
            sql: `SELECT Project.user_id FROM Project JOIN Cronjob ON Project.id = Cronjob.project_id WHERE Cronjob.id = ?;`,
            args: [parseInt(id!.toString())],
        })

        if (cron.rows.length <= 0 || cron.rows[0].user_id != validSession.user_id) {

            return new Response(null, {
                status: 400,
                statusText: 'Cron not found',
            });

        } else {

            const project = await connectdb().execute({
                sql: `DELETE FROM Cronjob WHERE id = ?;`,
                args: [parseInt(id!.toString())],
            })
            console.log(project)
            return new Response(null, {
                status: 200,
                statusText: 'Deleted Cron.',
            });

        }
    }
    return new Response(null, {
        status: 400,
        statusText: 'Cron not found',
    });
}