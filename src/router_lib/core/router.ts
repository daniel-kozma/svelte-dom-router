import type { Unsubscriber, Updater } from "svelte/store"
import { removeLastSlash } from "../util"

type RouteString = string

type CustomSubscriber = (value: RouteString) => boolean | void

class Router {
  #subs: CustomSubscriber[] = []
  subscribe(sub: CustomSubscriber): Unsubscriber {
    this.#subs.push(sub)
    return () => {
      this.#subs = this.#subs.filter(i => i !== sub)
    }
  }
  #route: RouteString = "DEFAULT_ROUTE"
  get(): RouteString { return this.#route }
  set(newRoute: RouteString): void{ this.#route = newRoute }
  update(update: Updater<RouteString>): void {this.#route = update(this.#route)}
  #dispatch(): void{
    for(const sub of this.#subs){
      const stop = sub(this.#route)
      if(stop === true)return
    }
  }
  goto(url: RouteString): void{
    this.#route = url
    this.#dispatch()
  }

  goBack(): void {history.back()}
  goForward(): void {history.forward()}
  goWithNumber(delta: number): void {history.go(delta)}
  
  constructor(){
    this.subscribe(value => history.pushState(value, value, value))
    window.addEventListener("DOMContentLoaded", () => router.goto(removeLastSlash(location.pathname)))
    window.addEventListener("popstate", () => this.goto(removeLastSlash(location.pathname)))
  }
}

const router = new Router()

export default router