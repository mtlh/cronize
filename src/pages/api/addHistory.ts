import { connectdb } from '@/db/connect';
import validateSession from '@/funcs/validateSession';
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {

    const body = await request.formData();
    
    const url = body.get('url')
    const status = body.get('status')

    const validSession = await validateSession(request)

    console.log(validSession.valid, url, status)
    if (validSession.valid && url && status) {
        await connectdb().execute({
            sql: `INSERT INTO PlaygroundHistory (url, status, user_id) VALUES (?, ?, ?)`,
            args: [url.toString(), status.toString(), validSession.user_id]
        })
    }

    return new Response(null, {
        status: 200,
    });
}