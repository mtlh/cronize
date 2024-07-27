import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");

  if (request.method === 'OPTIONS') {
    // Handle preflight request
    return new Response(null, { headers });
  }

  // log all request headers
  console.log(request.headers);

  return new Response("Headers logged in server.", { headers });
};
