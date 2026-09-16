import { env } from "$env/dynamic/private"

const ENVIRONMENT = env.ENVIRONMENT || "development"
const JUSO_API_KEY =
  env.JUSO_API_KEY || "devU01TX0FVVEgyMDI0MDMwNjE1MjczMjExNDU3MjI="
// const MONGODB_URI = env.MONGODB_URI || "mongodb://localhost:27017"
const MONGODB_URI =
  env.MONGODB_URI ||
  "mongodb+srv://vercel-admin-user:JSMOY8tx3uE5QYnu@db.kjnamha.mongodb.net/myFirstDatabase"
const BLOB_READ_WRITE_TOKEN = env.BLOB_READ_WRITE_TOKEN
const JWT_SECRET = env.JWT_SECRET || "secret_for_jwt"

const GOOGLE_CLIENT_ID =
  env.GOOGLE_CLIENT_ID ||
  "878325322351-4g0fss81ms3hda95p02225hjr4r5ql9v.apps.googleusercontent.com"

const GOOGLE_CLIENT_SECRET =
  env.GOOGLE_CLIENT_SECRET || "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"

const GOOGLE_REDIRECT_URI =
  env.GOOGLE_REDIRECT_URI || "http://localhost:5173/api/auth/google/callback"

const GOOGLE_DRIVE_FOLDER_ID =
  env.GOOGLE_DRIVE_FOLDER_ID || "1eHp63CC671vrFvHfOZffWhmR_OjH5q_8"

const GOOGLE_REFRESH_TOKEN =
  env.GOOGLE_REFRESH_TOKEN ||
  "1//0eASl8QlDND5NCgYIARAAGA4SNwF-L9IrepNvd_V0r_tmMUj-F9a0-dj_5R3hW2JHd4MzYrl5OaXFIMwYU5nz09c4nnc-V9P3-W4"
export {
  ENVIRONMENT,
  MONGODB_URI,
  JWT_SECRET,
  JUSO_API_KEY,
  BLOB_READ_WRITE_TOKEN,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  GOOGLE_DRIVE_FOLDER_ID,
  GOOGLE_REFRESH_TOKEN,
}
