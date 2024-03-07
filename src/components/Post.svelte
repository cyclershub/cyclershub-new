<script lang="ts">
	import type { Post, User } from "@prisma/client";
	import moment from "moment";

	export let post: Post & { user: User & { _count: { posts: number } } };
	export let author: User & { _count: { posts: number } };
</script>

<div class="flex flex-row">
	<div class="py-6 flex flex-col items-center bg-base-300 border-r border-t border-black px-6">
		<a class="avatar" href="/profile/{post.user.uid}">
			<div class="w-16 rounded-full">
				<img
					class="my-0"
					src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
				/>
			</div>
		</a>
		<span class="text-base text-base-content mt-2">
			{post.user.username}
		</span>
		{#if post.user.uid === author.uid}
			<span class="text-sm text-accent font-semibold">Author</span>
		{/if}
		<hr class="w-full my-2">
		<span class="text-xs text-base-content opacity-75">{post.user._count.posts} Posts</span>
		<span class="text-xs text-base-content opacity-75">123 Likes</span>
	</div>
	<div
		class="bg-base-300 p-6 border-black border-t first-of-type:border-t-0 w-full flex flex-col justify-between gap-4 no-underline cursor-pointer"
	>
		<p class="text-base-content text-lg my-0 mb-8">
			{post.message}
		</p>
		<span class="text-xs text-base-content opacity-60">Posted {moment(post.created_at).format("HH:mm, MMMM DD, YYYY")}</span>
	</div>
</div>
