import createSession from '@/funcs/createSession';
import signupProcess from '@/funcs/signup';
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, redirect }) => {

    const body = await request.formData();
    
    const email = body.get('email')
    const password = body.get('password')
    const confirmpassword = body.get('confpassword')
    const username = body.get('username')

    console.log(email, password, confirmpassword, username)

    // check if passwords match
    if (password !== confirmpassword) {
        return redirect('/signup')
    }

    const [status, message] = await signupProcess(email!.toString(), password!.toString(), username!.toString())
    console.log(status, message)

    if (status === "0") {
        return redirect('/')
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