import createSession from '@/funcs/createSession';
import loginProcess from '@/funcs/login';
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, redirect }) => {

    const body = await request.formData();
    
    const email = body.get('email')
    const password = body.get('password')

    console.log(email, password)

    const [status, message] = await loginProcess(email!.toString(), password!.toString())

    console.log(status, message)

    if (status === "0") {
        return redirect('/?error=' + encodeURIComponent(message))
    } else {
        
        // create a new session
        const sessionKey = await createSession(status)

        const headers = new Headers();
        headers.append('Set-Cookie', `sessionToken=${sessionKey}; HttpOnly; Secure; Path=/; Max-Age=604800`);
        headers.append('Location', '/profile');  // Redirect to profile

        // Return response with 302 status for redirection
        return new Response(null, {
            status: 302,
            headers: headers,
        });
    }
}