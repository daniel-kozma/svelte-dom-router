<script lang="ts">
	import condRouteRegistry from "./cond_route_registry";
	import Navigate from "../core/Navigate.svelte";
	import router from "../core/router";
	import { transformURL } from "../util";

  export let path: string | RegExp
  export let elem: ConstructorOfATypedSvelteComponent | null = null
  export let redirect: string | ((params: {[key: string]: string}) => string) | null = null
  export let notelem: ConstructorOfATypedSvelteComponent | null  = null // the notelem is shown when the path doesn't match
  $: newPath = transformURL(path)
  $: condRouteRegistry.update(r => [...r, newPath])
</script>

{#if newPath.test($router)}
  <slot params={newPath.exec($router).groups}></slot>
  {#if elem}
    <svelte:component params={newPath.exec($router).groups} this={elem}></svelte:component>
  {:else if redirect}
    {#if typeof redirect === "string"}
      <Navigate to={redirect}/>
    {:else}
      <Navigate to={redirect(newPath.exec($router).groups)}/>
    {/if}
  {/if}
{:else}
  {#if notelem}    
      <svelte:component this={notelem}></svelte:component>
  {/if}
{/if}