<script lang="ts">
  import Navigate from "../core/Navigate.svelte";
  import router from "../core/router";
	import { redirectUtil } from "../util";
  import routesRegistry, { type SignleRoute } from "./routes_registry";
  
  export let of: string = "DEFAULT_ROUTES_NAME"

  let route: SignleRoute = null
  routesRegistry.subscribe(v => route = v, of)
</script>

{#if route && route.path.test($router)}
  {#if route.elem}
    <svelte:component params={route.path.exec($router).groups} this={route.elem}></svelte:component>
  {:else if route.redirect}
      <Navigate to={redirectUtil(route.redirect, route.path.exec($router).groups)}/>
  {/if}
{/if}