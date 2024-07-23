import { connectdb } from '@/db/connect';
import validateSession from '@/funcs/validateSession';
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {

    const body = await request.formData();
    
    const url = body.get('url')
    const project_id = body.get('project_id')
    const status = body.get('name')
    const interval = body.get('interval')
    const daily_time = body.get('daily_time')
    const request_type = body.get('request_type')

    const validSession = await validateSession(request)

    console.log(validSession.valid, url, status)
    if (validSession.valid && url && status && interval && daily_time && project_id) {

        // check if user owns the project
        const project = await connectdb().execute({
            sql: `SELECT * FROM Project WHERE user_id = ? AND id = ?;`,
            args: [validSession.user_id, parseInt(project_id!.toString())],
        })

        if (project.rows.length > 0) {
            await connectdb().execute({
                sql: `INSERT INTO Cronjob (project_id, url, name, interval, daily_time, request_type) VALUES (?, ?, ?, ?, ?, ?);`,
                args: [parseInt(project_id!.toString()), url.toString(), status.toString(), interval!.toString(), daily_time!.toString(), request_type!.toString()],
            })

            return new Response(null, {
                status: 200,
            });

        } else {
            return new Response(null, {
                status: 400,
                statusText: 'Project not found',
            });
        }
    }

    return new Response(null, {
        status: 400,
        statusText: 'Project not found',
    });
}