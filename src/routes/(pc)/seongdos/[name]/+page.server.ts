/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ url, fetch }) => {
  console.log("seongdos/[name] page.server.ts")

  const name = decodeURIComponent(url.pathname.split("/")[2])

  let seongdo
  let response = await fetch(`/api/seongdos/${name}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })

  if (response.ok) {
    seongdo = (await response.json()).seongdo
  }

  return {
    seongdo,
  }
}
