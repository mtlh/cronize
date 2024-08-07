import { connectdb } from '@/db/connect';
import type { ProfileData } from '@/db/types';
import validateSession from '@/funcs/validateSession';
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request }) => {

    const validSession = await validateSession(request)

    if (validSession.valid) {
        const projectsandcronjobs = await connectdb().execute({
            sql: `SELECT c.id as id, c.name as name, p.id as project_id, p.name as project_name, c.name as name, c.last_run_time, c.last_run_status FROM Project p INNER JOIN Cronjob c ON p.id = c.project_id WHERE p.user_id = ? ORDER BY c.last_run_time DESC;`,
            args: [validSession.user_id]
        })

        // console.log(projectsandcronjobs.rows);

        // @ts-ignore
        const finalReturn: ProfileData = { cronjobs: [] };
        for (const project of projectsandcronjobs.rows) {
            try {
                // @ts-ignore
                finalReturn.cronjobs.push(project)
            } catch {}
        }
        
        return new Response(JSON.stringify(finalReturn), {
            status: 200,
        });

    } else {
        return new Response(JSON.stringify({}), {
            status: 200,
        });
    }
}