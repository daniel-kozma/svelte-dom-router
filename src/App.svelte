<script lang="ts">
	import DisplayRoutes from "./router_lib/routes/DisplayRoutes.svelte";
import routesRegistry from "./router_lib/routes/routes_registry";
	import About from "./routes/About.svelte";
	import Book from "./routes/Book.svelte";
	import Index from "./routes/Index.svelte";
	import NewBook from "./routes/NewBook.svelte";
	import NotFound from "./routes/NotFound.svelte";


	routesRegistry.add([{
		path: "/",
		elem: Index
	},{
		path: "/about",
		elem: About
	},{
		path: "/books",
		subroutes: [{
			path: "/",
			redirect: "/books/new"
		},{
			path: "/newbook",
			redirect: "/books/new"
		},{
			path: "/new",
			elem: NewBook
		},{
			path: "/:id",
			redirect: "/books/$<id>/read"
		},{
			path: "/:id/read",
			elem: Book
		}]
	},{
		path: "*",
		elem: NotFound
	}])
</script>

<DisplayRoutes/>