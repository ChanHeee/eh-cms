import { conn, dbConnect } from "$db/mongo"

export const handle = async ({ event, resolve }) => {
  // await dbConnect()
  const token = event.cookies.get("token")
  event.locals.token = token
  return resolve(event)
}
