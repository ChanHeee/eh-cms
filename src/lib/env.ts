import { env } from "$env/dynamic/private"

const ENVIRONMENT = env.ENVIRONMENT || "development"
// const MONGODB_URI = env.MONGODB_URI || "mongodb://localhost:27017"
const MONGODB_URI =
  env.MONGODB_URI ||
  "mongodb+srv://vercel-admin-user:JSMOY8tx3uE5QYnu@db.kjnamha.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const JWT_SECRET = env.JWT_SECRET || "secret_for_jwt"
export { ENVIRONMENT, MONGODB_URI, JWT_SECRET }
