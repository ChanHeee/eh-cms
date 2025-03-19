import type {
  ISeongdoSearchParams,
  ISeongdoResponse,
  ISeongdoSearchBody,
  IEducationResponse,
  IPage,
  ISeongdoEduPopulate,
  ISeongdo,
  ISeongdoEduPage,
} from "$lib/interfaces"
import { writable } from "svelte/store"

export const seongdoResponse = writable<ISeongdoResponse>()
export const seongdoSearchBody = writable<ISeongdoSearchBody>({
  sort: "nameDefault",
})
export const seongdoSearchParams = writable<ISeongdoSearchParams>({})

export const educationResponse = writable<IEducationResponse>()

export const SeongdoEdusStore = writable<ISeongdoEduPopulate[]>()
export const SeongdoEduPageStore = writable<ISeongdoEduPage>()

export const SeongdosStore = writable<ISeongdo[]>([])
export const SeongdoPageStore = writable<IPage>()

export const PageStore = writable<IPage>()

export const AllowedGroupStore = writable<string[]>()

export const SeongdoDeleteIdsStore = writable<string[]>()

export const target = writable<string>("")

// export function customStore(url) {
//   const name = writable("")
//   const jikbun = writable([])
//   const sort = writable("")
//   const eduName = writable("")
//   const skip = writable()

//   function update(updater) {
//     curr.update((currentValue) => {
//       prev.set(currentValue)
//       return updater(currentValue)
//     })
//   }

//   function set(newValue) {
//     update(() => newValue)
//   }

//   function undo() {
//     prev.update((prevValue) => {
//       curr.set(prevValue)
//       return undefined
//     })
//   }

//   return {
//     curr: {
//       ...curr,
//       update,
//       set,
//     },
//     prev: readonly(prev),
//     undo,
//   }
// }
