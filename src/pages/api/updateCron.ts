import { connectdb } from '@/db/connect';
import validateSession from '@/funcs/validateSession';
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {

    const body = await request.formData();
    
    const id = body.get('id')
    const name = body.get('name')
    const url = body.get('url')
    const request_type = body.get('request_type')
    const request_headers = body.get('request_headers')
    const request_body = body.get('request_body')
    const interval = body.get('interval')
    const daily_time = body.get('daily_time')
    const active = body.get('active')?.toString().toLowerCase() === 'true'

    const validSession = await validateSession(request)

    console.log(validSession.valid, id, url, name)
    if (validSession.valid && id && url && name && interval) {

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
                sql: `UPDATE Cronjob SET url = ?, name = ?, interval = ?, daily_time = ?, request_type = ?, request_headers = ?, request_body = ?, active = ? WHERE id = ?;`,
                args: [url!.toString(), name!.toString(), interval!.toString(), daily_time!.toString(), request_type!.toString(), request_headers!.toString(), request_body!.toString(), active, parseInt(id!.toString())],
            })
            console.log(project)
            return new Response(null, {
                status: 200,
                statusText: 'Updated Cron.',
            });

        }
    }
    return new Response(null, {
        status: 400,
        statusText: 'Cron not found',
    });
}