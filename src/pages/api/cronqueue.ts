import { connectdb } from '@/db/connect';
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request }) => {

    // check all cronjobs with the same minute
    const minute = new Date().getMinutes()

    // return rows are all cronjobs with the same minute
    const minCrons = await connectdb().execute({
        sql: `SELECT * FROM Cronjob WHERE strftime('%M', daily_time) = ? AND active = 1`,
        args: [minute < 10 ? '0' + minute : '' + minute] // Format minute to two digits
    });

    console.log(minCrons)

    let doExec = false;

    // if interval is hourly and it matches the current hour, add to execution queue
    if (minCrons.rows.length > 0) {
        for (let i = 0; i < minCrons.rows.length; i++) {
            if (minCrons.rows[i].interval === 'hourly') {
                const queue = await connectdb().execute({
                    sql: `INSERT INTO CronjobExecutionQueue (cronjob_id) VALUES (?);`,
                    args: [minCrons.rows[i].id]
                })
                console.log(queue)
                doExec = true;
            }
        }
    }

    // if interval is daily, check if the hour matches then add to execution queue
    if (minCrons.rows.length > 0) {
        for (let i = 0; i < minCrons.rows.length; i++) {

            console.log(minCrons.rows[i].id, new Date().getHours(), minCrons.rows[i].daily_time!.toString().split(' ')[1].split(':')[0])

            if (minCrons.rows[i].interval === 'daily' && new Date().getHours() === parseInt(minCrons.rows[i].daily_time!.toString().split(' ')[1].split(':')[0])) {
                const queue = await connectdb().execute({
                    sql: `INSERT INTO CronjobExecutionQueue (cronjob_id) VALUES (?);`,
                    args: [minCrons.rows[i].id]
                })
                console.log(queue)
                doExec = true;
            }
        }
    }

    // if interval is weekly, check if the day and hour matches then add to execution queue
    if (minCrons.rows.length > 0) {
        for (let i = 0; i < minCrons.rows.length; i++) {

            console.log(minCrons.rows[i].id, new Date().getHours(), minCrons.rows[i].daily_time!.toString().split(' ')[1].split(':')[0], new Date().getDay(), new Date(minCrons.rows[i].daily_time!.toString()).getDay())

            if (minCrons.rows[i].interval === 'weekly' && new Date().getHours() === parseInt(minCrons.rows[i].daily_time!.toString().split(' ')[1].split(':')[0])
                && new Date().getDay() === new Date(minCrons.rows[i].daily_time!.toString()).getDay()) {
                const queue = await connectdb().execute({
                    sql: `INSERT INTO CronjobExecutionQueue (cronjob_id) VALUES (?);`,
                    args: [minCrons.rows[i].id]
                })
                console.log(queue)
                doExec = true;
            }
        }
    }

    // if interval is one-off, check if the date, hour and minute matches then add to execution queue
    if (minCrons.rows.length > 0) {
        for (let i = 0; i < minCrons.rows.length; i++) {
            if (minCrons.rows[i].interval === 'single'
                && new Date().getHours() === parseInt(minCrons.rows[i].daily_time!.toString().split(' ')[1].split(':')[0])
                && new Date().getDay() === new Date(minCrons.rows[i].daily_time!.toString()).getDay() 
                && new Date(minCrons.rows[i].daily_time!.toString()).getMonth() === new Date().getMonth()
                && new Date(minCrons.rows[i].daily_time!.toString()).getFullYear() === new Date().getFullYear()
            ){
                const queue = await connectdb().execute({
                    sql: `INSERT INTO CronjobExecutionQueue (cronjob_id) VALUES (?);`,
                    args: [minCrons.rows[i].id]
                })
                console.log(queue)
                doExec = true;
            }
        }
    }

    if (doExec) {
        fetch('/api/cronexecute')
    } else {
        const isQueued = await connectdb().execute(`SELECT COUNT(*) FROM CronjobExecutionQueue`)
        if (isQueued.rows.length > 0) {
            return new Response(JSON.stringify({
                status: 'no-queue'
            }), {
                status: 200,
            });
        } else {
            fetch( new URL('/api/cronexecute', import.meta.url).href )
        }
    }

    return new Response(JSON.stringify({}), {
        status: 200,
    });
}