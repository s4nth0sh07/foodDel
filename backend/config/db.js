import pg from "pg"
import dotenv from 'dotenv'

dotenv.config()

export const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: 'Tomato',
    password: process.env.PASSWORD,
    port: 5433,
})
