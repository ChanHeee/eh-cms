import { env } from "$env/dynamic/private"

const ENVIRONMENT = env.ENVIRONMENT || "development"
const JUSO_API_KEY = env.JUSO_API_KEY
const MONGODB_URI = env.MONGODB_URI || "mongodb://localhost:27017"

const JWT_SECRET = env.JWT_SECRET || "secret_for_jwt"
export { ENVIRONMENT, MONGODB_URI, JWT_SECRET, JUSO_API_KEY }
