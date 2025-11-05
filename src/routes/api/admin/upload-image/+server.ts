import { json } from "@sveltejs/kit"
import { writeFile } from "fs/promises" // Node.js의 promise 버전 파일 시스템 모듈
import path from "path"

export async function POST({ request, cookies }) {
  const data = await request.formData()
  const image = data.get("image")
  const name = data.get("name")

  const base64Data = image.replace(/^data:image\/jpeg;base64,/, "")

  // 파일을 저장할 경로를 지정합니다.
  const uploadPath = path.join(
    process.cwd(),
    "static",
    "images",
    name + ".jpeg"
  )

  // 파일을 서버 폴더에 저장합니다.
  // const imageBufferData = Buffer.from(await file.arrayBuffer())
  // await writeFile(uploadPath, imageBufferData)

  await writeFile(uploadPath, base64Data, "base64")

  return json({ msg: "ok", file: "/static/images/" + name }, { status: 200 })
}
