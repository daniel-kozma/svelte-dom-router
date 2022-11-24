<script lang="ts">
	import condRouteRegistry from "./cond_route_registry";
	import Navigate from "../core/Navigate.svelte";
	import router from "../core/router";


  export let elem: ConstructorOfATypedSvelteComponent | null = null
  export let redirect: string | null = null

  let show = false
  router.subscribe(currentRoute => {
    condRouteRegistry.subscribe(registeredRoutes => {
      show = !registeredRoutes.some(regex => regex.test(currentRoute))
    })
  })
</script>

{#if show}
  <slot></slot>
  {#if elem}
    <svelte:component this={elem}></svelte:component>
  {:else if redirect}
    <Navigate to={redirect}/>
  {/if}
{/if}