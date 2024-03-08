<script lang="ts">
	import type { Forum } from "@prisma/client";
	import moment from "moment";
	import { Bookmark, Pencil1, EyeOpen } from "radix-svelte-icons";
	import { ripple } from "svelte-ripple-action";

	export let forum: Forum & { _count: { subscribers: number; threads: number } };
</script>

<a href={`/forums/${forum.slug}`} class="no-underline grid grid-cols-1 lg:grid-cols-2 gap-4 bg-base-200 rounded-lg" use:ripple>
	<img
		src={forum.banner}
		class="object-fit my-0 rounded-t-lg md:rounded-l-lg md:rounded-t-none"
		alt=""
	/>
	<div class="p-6 flex flex-col justify-between">
		<div>
			<h3 class="font-bold text-base-content text-lg my-0 mb-2 leading-5">
				{forum.title}
			</h3>
			<p class="text-sm opacity-80 line-clamp-6">{forum.description}</p>
			<div class="flex flex-row gap-8 mb-4">
				<span class="flex flex-col items-center gap-2 text-sm">
					<Bookmark size={20} />{" "}
					{forum._count.subscribers}
				</span>
				<span class="flex flex-col items-center gap-2 text-sm">
					<Pencil1 size={20} /> {forum._count.threads}
				</span>
				<span class="flex flex-col items-center gap-2 text-sm">
					<EyeOpen size={20} /> {forum.views}
				</span>
			</div>
		</div>
		<span class="flex flex-row gap-2 text-xs opacity-50">
			Created{" "}
			{moment(forum.created_at).format(
				"MMMM DD, YYYY"
			)}
		</span>
	</div>
</a>