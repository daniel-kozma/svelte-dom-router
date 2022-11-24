import About from '../routes/About.svelte';
import Book from '../routes/Book.svelte';
import Index from '../routes/Index.svelte';
import NewBook from '../routes/NewBook.svelte';
import router from './core/router';
import type { InputSingleRoute, SignleRoute } from './routes/routes_registry';

export function transformURL(url: string | RegExp): RegExp{
  if(typeof url !== "string")return url
  const paramReplaceRegex = /(?:\/\:)(?<param>\w+)/g
  url = url.replaceAll(paramReplaceRegex, "\\/(?<$1>(\\w|\\d)+)")
  url = url.replaceAll(/\*/g, ".*")
  url = `^${url}$`
  url = new RegExp(url)
  return url
}

export function urlStringToRegex(url: string | RegExp): RegExp{
  if(typeof url !== "string")return url
  const paramReplaceRegex = /(?:\/\:)(?<param>\w+)/g
  url = url.replaceAll(paramReplaceRegex, "\\/(?<$1>(\\w|\\d)+)")
  url = url.replaceAll(/\*/g, ".*")
  url = new RegExp(url)
  return url
}

export function regexToFinalURL(regex: RegExp): RegExp{
  let newRegex = regexToString(regex)
  if(newRegex[0] !== "^")newRegex = "^" + newRegex
  if(newRegex[newRegex.length-1] !== "$")newRegex = newRegex + "$"
  return new RegExp(newRegex)
}

export function removeLastSlash(str: string): string{
  if(str === "/")return str
  if(str[str.length - 1] !== "/")return str
  return str.slice(0, -1)
}

export function removeFirstSlash(str: string): string{
  if(str === "/")return str
  if(str[0] !== "/")return str
  return str.slice(1)
}

export function removeSlashes(str: string):string{
  return removeFirstSlash(removeLastSlash(str))
}

export function concatRegex(regexes: RegExp[]): RegExp{
  let newRegexes = regexes.map(r => regexToString(r))
  return new RegExp(newRegexes.join(""))
}

export function redirectUtil(raw: string, params: {[k:string]:string}): string{
  return raw.replaceAll(/\$\<(?<id>\w+)\>/g, (substr) => params[substr.slice(2, -1)])
}

export function getMatchingRoute(routesToChooseFrom: SignleRoute[]): SignleRoute{
  // console.log(routesToChooseFrom)
  for (const possibleRoute of routesToChooseFrom){
    if(typeof possibleRoute.path === "string"){
      if(possibleRoute.path === router.get()){
        return possibleRoute
      }
    }else{
      if(possibleRoute.path.test(router.get())){
      return possibleRoute
      }
    }
  }
}

export function transformInputRoutesRecursively(input: InputSingleRoute[], pathSegments: RegExp[] = []){
  return input.map(route => {
    let newRoute: Partial<SignleRoute> = {}
    if(route.elem)newRoute.elem = route.elem
    if(route.redirect)newRoute.redirect = route.redirect

    const newPath = urlStringToRegex(route.path)

    if(!route.subroutes){
      newRoute.pathSegments = [...pathSegments]
      newRoute.path = concatRegex([...pathSegments, newPath])
      if(regexToString(newRoute.path).slice(-2) === "\\/" && regexToString(newRoute.path) !== "\\/")newRoute.path = new RegExp(`${regexToString(newRoute.path).slice(0, -2)}`)
      return [newRoute]
    }

    return [transformInputRoutesRecursively(route.subroutes, [...pathSegments, newPath])]
  })
}


export function transformInputRoutes(input: InputSingleRoute[]): SignleRoute[]{
  return transformInputRoutesRecursively(input).flat(Infinity).map(r => {
    r.path = new RegExp(`^${regexToString(r.path)}$`)
    return r
  })
}


function regexToString(input: RegExp | string){
  if(typeof input === "string")return input
  return input.toString().slice(1, -1)
}

// This is old code don't use it
// export function transformInputRoutes(input: InputSingleRoute[], pathContext?: string): SignleRoute[]{
//   let res = (input.map(inputRoute => {
//     if(!inputRoute.subroutes){
//       if(pathContext){
//         inputRoute.path = pathContext + inputRoute.path
//         inputRoute.path = removeLastSlash(inputRoute.path)
//         if(inputRoute.redirect && typeof inputRoute.redirect === "string"){
//           inputRoute.redirect = pathContext + inputRoute.redirect
//         }
//       }
//       return inputRoute as SignleRoute
//     }
//     return transformInputRoutesToFlatRegexRoutes(inputRoute.subroutes, inputRoute.path as string)
//   })).flat(Infinity) as SignleRoute[]
//   if(!pathContext){
//     res = res.map(r => {
//       r.path = transformURL(r.path)
//       return r
//     })
//   }
//   return res
// }