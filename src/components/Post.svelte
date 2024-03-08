<script lang="ts">
	import type { Post, User } from "@prisma/client";
	import moment from "moment";

	export let post: Post & { _count: {likes: number}, user: User & { _count: { posts: number } } };
	export let author: User & { _count: { posts: number } };
</script>

<div class="flex flex-col md:flex-row">
	<div class="pt-6 md:pb-6 flex flex-row md:flex-col bg-base-200 md:border-r border-t border-black px-6 md:max-w-32 w-full gap-4 items-center">
		<a class="avatar" href="/profile/{post.user.uid}">
			<div class="w-12 rounded-full">
				<img
					class="my-0"
					src={post.user.avatar || "/images/default-avatar.svg"}
				/>
			</div>
		</a>
		<div class="flex flex-col md:items-center">
			<span class="text-base text-base-content mt-0">
				{post.user.username}
			</span>
			{#if post.user.uid === author.uid}
				<span class="text-sm text-accent font-semibold">Author</span>
			{/if}
		</div>
		<div class="hidden md:flex flex-col items-center">
			<hr class="w-full my-2">
			<span class="text-xs text-base-content opacity-75">{post.user._count.posts} Posts</span>
			<span class="text-xs text-base-content opacity-75">{post._count.likes} Likes</span>
		</div>
	</div>
	<div
		class="bg-base-200 p-6 border-black md:border-t first-of-type:border-t-0 w-full flex flex-col justify-between gap-4"
	>
		<div class="prose prose-sm text-base-content text-base my-0 mb-8">
			{@html post.message}
		</div>
		<span class="text-xs text-base-content opacity-60">Posted {moment(post.created_at).format("HH:mm, MMMM DD, YYYY")}</span>
	</div>
</div>
