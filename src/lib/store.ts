import { writable } from "svelte/store"
import type {
  ISeongdo,
  ISeongdoResponse,
  ISeongdoSearchBody,
} from "./interface"

export const currentUser = writable<{ user: { name: string } }>()

export const page = writable("seongdo")
export const tab = writable("seongdo")
export const tableSort = writable("nameDefault")

export const searchName = writable("")
export const jikbunList = writable([])

export const seongdoDetail = writable<ISeongdo>()
export const seongdoResponse = writable<ISeongdoResponse>()

export const seongdoSearchBody = writable<ISeongdoSearchBody>({
  sort: "nameDefault",
})

export const eduName = writable("")
export const checkedSeongdo = writable({})
