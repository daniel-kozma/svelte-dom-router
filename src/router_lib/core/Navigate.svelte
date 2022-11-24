<script lang="ts">
	import { onMount } from "svelte";
	import router from "./router";


  export let to: string
  onMount(() => router.goto(to))
</script>
