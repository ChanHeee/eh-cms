export const handle = async (value) => {
  const { event, resolve } = value

  const token =
    event.cookies.get("token") || event.request.headers.get("authorization")
  if (token) {
    event.request.headers.set("authorization", token)
  }
  event.locals.token = token

  return resolve(event)
}

export const handleFetch = (value) => {
  const { request, fetch, event } = value

  const token =
    event.cookies.get("token") || request.headers.get("authorization")
  if (token) {
    event.request.headers.set("authorization", token)
  }
  event.locals.token = token

  return fetch(request)
}
