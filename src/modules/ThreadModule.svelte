<script lang="ts">
	import MobileThreadFooter from "@components/MobileThreadFooter.svelte";
	import PostThreadComment from "@components/PostThreadComment.svelte";
	import type { Thread, User, Post, Forum } from "@prisma/client";
	import PostComponent from "@components/Post.svelte"
	import moment from "moment";
	import { ArrowLeft, Bookmark, BookmarkFilled } from "radix-svelte-icons";
	import trpc from "src/trpc";


	export let page: number;
	export let thread: Thread & { _count: { posts: number }, user: User, posts: Post[] };
	export let user: User;
	export let forum: Forum;
	export let latestPost: Post & { user: User };

function generatePagination(
	currentPage: number,
	totalResults: number,
	resultsPerPage: number
) {
	const totalPages = Math.ceil(totalResults / resultsPerPage);
	const pagination = [];

	let startPage: number, endPage: number;
	if (totalPages <= 5) {
		startPage = 1;
		endPage = totalPages;
	} else {
		if (currentPage <= 3) {
			startPage = 1;
			endPage = 5;
		} else if (currentPage + 2 >= totalPages) {
			startPage = totalPages - 4;
			endPage = totalPages;
		} else {
			startPage = currentPage - 2;
			endPage = currentPage + 2;
		}
	}

	for (let i = startPage; i <= endPage; i++) {
		pagination.push(i);
	}

	return pagination;
}
let pagination = generatePagination(page, thread._count.posts, 25);

export let isSubscribed: boolean; 

async function toggleThreadSubscription() {
	if (isSubscribed) {
		const response = await trpc.forum.threads.unsubscribe.mutate({
			uidThread: thread.uid,
		})

		isSubscribed = false;
	} else {
		const response = await trpc.forum.threads.subscribe.mutate({
			uidThread: thread.uid,
		})

		isSubscribed = true;
	}
}

</script>

<div class="max-w-screen-xl mx-auto">
	<div class="text-sm breadcrumbs">
		<ul class="flex flex-row flex-wrap px-6">
			<li class="text-wrap"><a href="/forums">Forums</a></li>
			<li class="text-wrap"><a href={`/forums/${forum.slug}`}>{forum.title}</a></li>
			<li class="text-wrap">{thread.title}</li>
		</ul>
	</div>
	<div
		class="my-4 h-16 w-full bg-base-300 relative flex justify-between items-center px-6"
	>
			<div class="flex flex-row items-center">
				<a
				class="avatar"
				href="/profile/${thread.user.uid}"
			>
				<div class="w-12 rounded-full">
					<img class="my-0" src={thread.user.avatar || "/images/default-avatar.svg"} />
				</div>
			</a>
			<div class="flex flex-col text-end ml-4">
				<h3 class="my-0 text-xl">{thread.user.username}</h3>
				<span class="my-0 text-xs"
					>{moment(thread.created_at).fromNow()}</span
				>
			</div>
			</div>
			<div>
				<button class="btn btn-ghost btn-square" on:click={toggleThreadSubscription}>
					{#if isSubscribed}
					<BookmarkFilled size={24}></BookmarkFilled>
					{:else}
					<Bookmark size={24}></Bookmark>
					{/if}
				</button>
			</div>
	</div>
	<div class="bg-base-200">
		<div
			class="grid md:grid-cols-[1fr_300px] p-6 items-start border-b border-b-black"
		>
		<div class="flex flex-col md:flex-row-reverse gap-2">
			<div
				class="grid grid-cols-[1fr_1fr_1.5fr] text-center items-center gap-6"
			>
				<span class="flex justify-center">Posts</span>
				<span class="flex justify-center">Views</span>
				<span class="flex justify-center">Latest</span>
			</div>
			<div class="grid grid-cols-[1fr_1fr_1.5fr] text-center gap-6">
				<span class="text-sm text-base-content"
					>{thread._count.posts}</span
				>
				<span class="text-sm text-base-content">{thread.views}</span
				>
				<div class="flex flex-col">
					<span class="text-sm text-base-content"
						>{
							moment(latestPost.created_at).format("MMMM DD")
						}</span
					>
					<span class="text-sm text-base-content opacity-45"
						>By {latestPost.user.username}</span
					>
				</div>
			</div>
		</div>
		<hr>
			<h1 class="text-xl font-semibold mb-0">{thread.title}</h1>
		</div>
		<div class="flex flex-col justify-between p-6">
			<p class="my-0 mb-8 text-base text-base-content">
				{thread.description}
			</p>
			<span class="text-xs text-base-content opacity-60"
				>Posted {
					moment(thread.created_at).format("HH:mm, MMMM DD, YYYY")
				}</span
			>
		</div>
	</div>
	<div class="flex flex-col">
		{#each thread.posts as post}
		<PostComponent post={post} author={thread.user} />
		{/each}
	</div>
	{#if pagination.length > 1}
	<div class="join mt-4">
		{#if page > 0}
		<a class="no-underline join-item btn bg-base-300 border-base-300">
			<ArrowLeft size={16} />
		</a>
		{/if}
		{#each pagination as pageNum}
			<a class="no-underline join-item btn bg-base-300 border-base-300">
				{pageNum}
			</a>
		{/each}
		{#if page < Math.floor(thread._count.posts / 25)}
			<a class="no-underline join-item btn bg-base-300 border-base-300">
				<ArrowLeft size={16} />
			</a>
		{/if}
	</div>
	{/if}
	<div class="hidden md:block">
		<PostThreadComment thread={thread} user={user} />
	</div>
</div>
