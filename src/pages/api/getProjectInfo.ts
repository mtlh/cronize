import { connectdb } from '@/db/connect';
import validateSession from '@/funcs/validateSession';
import type { APIRoute } from 'astro'
import type { ProjectInfo } from '@/db/types';

export const GET: APIRoute = async ({ request }) => {

    const validSession = await validateSession(request)

    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id') || '0');

    if (validSession.valid) {
        const projects = await connectdb().execute({
            sql: `
           SELECT 
                p.name AS project_name, 
                p.description, 
                p.created_at AS project_created_at, 
                p.updated_at AS project_updated_at, 
                c.id AS cronjob_id, 
                c.project_id,
                c.url,
                c.name AS cronjob_name, 
                c.created_at AS cronjob_created_at, 
                c.updated_at AS cronjob_updated_at, 
                c.interval, 
                c.request_type,
                c.daily_time, 
                c.last_run_time, 
                c.last_run_status,
                c.active
            FROM 
                Project p
            INNER JOIN
                Cronjob c ON p.id = c.project_id
            WHERE 
                p.id = ? 
                AND p.user_id = ?
            ORDER BY 
                p.created_at ASC;
            `,
            args: [id, validSession.user_id]
        })

        if (projects.rows.length === 0) {

            const project = await connectdb().execute({
                sql: `
               SELECT 
                    *
                FROM 
                    Project p
                WHERE 
                    p.id = ? 
                    AND p.user_id = ?
                ORDER BY 
                    p.created_at ASC;
                `,
                args: [id, validSession.user_id]
            })

            if (project.rows.length === 0) {
                return new Response(JSON.stringify({}), {
                    status: 401,
                });
            } else {

                // console.log(project.rows);
                // return single object
                const Project: ProjectInfo = {
                    id: parseInt(project.rows[0].id as string),
                    name: project.rows[0].name?.toString() || '',
                    description: project.rows[0].description?.toString() || '',
                    created_at: project.rows[0].created_at?.toString() || '',
                    updated_at: project.rows[0].updated_at?.toString() || '',
                    cronjobs: [],
                };
                return new Response(JSON.stringify(Project), {
                    status: 200,
                });
            }
            
        } else {

            // return single object
            const Project: ProjectInfo = {
                id: parseInt(projects.rows[0].project_id as string),
                name: projects.rows[0].project_name?.toString() || '',
                description: projects.rows[0].description?.toString() || '',
                created_at: projects.rows[0].project_created_at?.toString() || '',
                updated_at: projects.rows[0].project_updated_at?.toString() || '',
                cronjobs: [],
            };

            // console.log(projects.rows);

            // get cronjobs
            for (const cronjob of projects.rows) {
                Project.cronjobs.push({
                    id: parseInt(cronjob.cronjob_id as string),
                    project_id: parseInt(cronjob.project_id as string),
                    name: cronjob.cronjob_name?.toString() || '',
                    url: cronjob.url?.toString() || '',
                    created_at: cronjob.cronjob_created_at?.toString() || '',
                    updated_at: cronjob.cronjob_updated_at?.toString() || '',
                    interval: cronjob.interval?.toString() || '',
                    daily_time: cronjob.daily_time?.toString() || '',
                    last_run_time: cronjob.last_run_time?.toString() || '',
                    last_run_status: cronjob.last_run_status?.toString() || '',
                    request_type: cronjob.request_type?.toString() || '',
                    active: parseInt(cronjob.active as string || '0') === 1,
                });
            }

            return new Response(JSON.stringify(Project), {
                status: 200,
            });
        }

    } else {
        return new Response(JSON.stringify({}), {
            status: 401,
        });
    }
}