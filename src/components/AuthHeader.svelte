<script lang="ts">
	import ThemeController from "./ThemeController.svelte";
</script>

<nav class="navbar bg-base-100 h-20 sticky top-0 z-10">
	<div class="flex flex-row justify-between w-full mx-auto px-8">
		<a href="/" class="link link-hover text-xl hidden md:block">
			<img src="/images/logo.svg" width="96" alt="CyclersHub">
		</a>
		<ThemeController></ThemeController>
	</div>
</nav>