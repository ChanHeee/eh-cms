/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ locals }) => {
  const { group2 } = locals.searchParams
  return { group2 }
}
