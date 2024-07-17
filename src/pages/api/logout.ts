import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({}) => {

    const headers = new Headers();
    headers.append('Set-Cookie', `sessionToken=; HttpOnly; Secure; Path=/; Max-Age=604800`);
    headers.append('Location', '/');

    return new Response(null, {
        status: 302,
        headers: headers,
    });
}