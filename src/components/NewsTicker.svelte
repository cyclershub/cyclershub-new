<script lang="ts">
	import { onMount } from "svelte";
	import trpc from "../trpc";

	let threads = [];

	onMount(async () => {
		threads = await trpc.forum.getThreads.query({ limit: 4 });

		trpc.forum.news.subscribe(null, {
			onData: (thread) => {
				threads.push(thread);
				threads = threads;
			},
		});
	});
	
</script>

<div
	class="mt-16 h-16 w-full bg-base-200 relative grid grid-cols-[1fr_300px] justify-between items-center px-6"
>
	<h2 class="my-0">News</h2>
</div>
<div class="bg-base-300">
	{#if threads.length > 0}
		{#each threads as thread}
			<a
				href={`/forums/${thread.forum.slug}/${thread.slug}`}
				class="px-6 py-4 flex flex-row"
			>
				{thread.title}
			</a>
		{/each}
	{/if}
</div>
