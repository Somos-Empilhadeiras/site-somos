import postgres from 'postgres'
import dotenv from 'dotenv'

const connectionString = process.env.DATABASE_URL
const sql = postgres(String(connectionString))

export default sql