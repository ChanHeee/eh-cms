import type {
  ISeongdoSearchParams,
  ISeongdoResponse,
  ISeongdoSearchBody,
  IEducationResponse,
} from "$lib/interfaces"
import { writable } from "svelte/store"

export const seongdoResponse = writable<ISeongdoResponse>()
export const seongdoSearchBody = writable<ISeongdoSearchBody>({
  sort: "nameDefault",
})
export const seongdoSearchParams = writable<ISeongdoSearchParams>({})

export const educationResponse = writable<IEducationResponse>()

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
