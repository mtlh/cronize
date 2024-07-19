import { connectdb } from '@/db/connect';
import validateSession from '@/funcs/validateSession';
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {

    const body = await request.formData();
    
    const name = body.get('name')
    const description = body.get('description')

    const validSession = await validateSession(request)

    if (validSession.valid && description && name) {

        await connectdb().execute({
            sql: `INSERT INTO Project (name, description, user_id) VALUES (?, ?, ?)`,
            args: [name.toString(), description.toString(), validSession.user_id]
        })

        return new Response("s", {
            status: 200,
        });
        
    } else {
        return new Response("f", {
            status: 200,
        });
    }
}