import { writable } from "svelte/store"

const condRouteRegistry = writable<RegExp[]>([])
export default condRouteRegistry