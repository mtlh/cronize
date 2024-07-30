import { connectdb } from '@/db/connect';
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request }) => {

    // record time so endpoint runs for less than 10 seconds
    const time = new Date().getTime()

    // Get from current execution queue
    const queue = await connectdb().execute({
        sql: `SELECT * FROM CronjobExecutionQueue INNER JOIN Cronjob ON CronjobExecutionQueue.cronjob_id = Cronjob.id;`,
        args: []
    });

    console.log(queue)

    // execute first item in queue
    if (queue.rows.length > 0) {
        let runStatus = 400;
        // fetch cronjob
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), 8000); // 8000 ms = 8 seconds
        const requestHeaders = new Headers();
        for (const [key, value] of JSON.parse(queue.rows[0].request_headers!.toString())) {
            requestHeaders.append(key.toString(), value.toString());
        }
        fetch(`${queue.rows[0].url}`, { signal: abortController.signal, headers: requestHeaders, method: queue.rows[0].request_method!.toString() })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res;
        })
        .then(res => {
            clearTimeout(timeoutId); // Clear the timeout if the request completes in time
            runStatus = res.status;
        })
        .catch(error => {
            if (error.name === 'AbortError') {
                console.error('Fetch request timed out');
            } else {
                console.error('Fetch request failed', error);
            }
        });

        const execute = await connectdb().execute({
            sql: `INSERT INTO CronjobHistory (cronjob_id, status, ran_time) VALUES (?, ?, CURRENT_TIMESTAMP);`,
            args: [queue.rows[0].cronjob_id, runStatus.toString()]
        })
        console.log(execute)

        const remove = await connectdb().execute({
            sql: `DELETE FROM CronjobExecutionQueue WHERE id = ?`,
            args: [queue.rows[0].id]
        })
        console.log(remove)
    }

    return new Response(JSON.stringify({}), {
        status: 200,
    });
}