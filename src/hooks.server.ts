export const handle = async ({ event, resolve }) => {
  console.log("hook.server handle")
  const token = event.cookies.get("token")
  event.locals.token = token
  return resolve(event)
}

export const handleFetch = ({ request, fetch, event }) => {
  let token = event.cookies.get("token")

  if (token) {
    request.headers.set("authorization", token)
  }

  return fetch(request)
}
