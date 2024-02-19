export const load = async ({ request, fetch, url }) => {
  let requestUrl = `/api/simbangs${decodeURI(url.search)}`

  const response = await fetch(requestUrl, {
    headers: {
      "content-type": "application/json",
    },
  })

  const { simbangs, page } = await response.json()
  return { simbangs, page }
}
