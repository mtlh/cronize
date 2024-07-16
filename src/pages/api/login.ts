import loginProcess from '@/funcs/login';
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, redirect }) => {

    const body = await request.formData();
    
    const email = body.get('email')
    const password = body.get('password')

    console.log(email, password)

    const [status, message] = await loginProcess(email!.toString(), password!.toString())

    console.log(status, message)

    return redirect('/profile')
}