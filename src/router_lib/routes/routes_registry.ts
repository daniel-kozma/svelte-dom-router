import type { Subscriber, Unsubscriber, Updater } from "svelte/store"
import router from "../core/router"
import { getMatchingRoute, transformInputRoutes } from "../util"

const { log } = console

export type InputSingleRoute = {
  path: string | RegExp
  elem?: ConstructorOfATypedSvelteComponent
  redirect?: string
  subroutes?: InputSingleRoute[]
}

export type SignleRoute = {
  pathSegments: RegExp[]
  path: RegExp
  elem?: ConstructorOfATypedSvelteComponent
  redirect?: string
}

type RoutesContent = SignleRoute[]

type Routes = {[key: string]: RoutesContent}

class RoutesRegistry {
  #subs: {sub: Subscriber<SignleRoute>, name: string}[] = []
  subscribe(sub: Subscriber<SignleRoute>, name: string): Unsubscriber{
    const i = this.#subs.length
    this.#subs.push({sub, name})
    return () => this.#subs.splice(i, 1)
  }

  #routes: Routes = {}

  get(): Routes{return this.#routes}
  set(newRoutes: Routes): void{this.#routes = newRoutes}
  update(updater: Updater<Routes>): void {this.#routes = updater(this.#routes)}

  add(routesContent: InputSingleRoute[], name: string = "DEFAULT_ROUTES_NAME"){
    this.#routes[name] = transformInputRoutes(routesContent)
    this.#dispatch()
  }

  #dispatch(): void{
    for(const {sub, name} of this.#subs){
      const match = getMatchingRoute(this.#routes[name])
      sub(match)
    }
  }

  constructor(){
    router.subscribe(() => this.#dispatch())
  }
}

const routesRegistry = new RoutesRegistry()

export default routesRegistry