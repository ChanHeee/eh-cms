import { json } from "@sveltejs/kit"
import { truncate, unlink, writeFile } from "fs/promises" // Node.js의 promise 버전 파일 시스템 모듈
import path from "path"

export async function POST({ request, cookies }) {
  const data = await request.formData()
  const name = data.get("name")

  const uploadPath = path.join(
    process.cwd(),
    "static",
    "images",
    name + ".jpeg"
  )

  await unlink(uploadPath)

  return json(
    { msg: "deleted", file: "/static/images/" + name },
    { status: 200 }
  )
}
