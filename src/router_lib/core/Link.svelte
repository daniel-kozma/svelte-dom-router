<script lang="ts">
	import router from "./router";


  export let to: string = "/"
</script>

<a href={to} on:click={e => {
  e.preventDefault()
  router.goto(to)
}}>
  <slot></slot>
</a>