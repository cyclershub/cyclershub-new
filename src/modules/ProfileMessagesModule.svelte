<script script lang="ts">
	import type { User } from "@prisma/client";
	import moment from "moment";
	import Cookies from "js-cookie";
	import trpc from "../trpc";
	
	let conversations = []

	export let user: User;

	const accessToken = Cookies.get("accessToken") as string;

	(async () => {
		conversations = await trpc.messages.getConversations.query({ accessToken })
	})()
</script>

<div class="max-w-screen-xl w-full mx-auto">
	<div class="prose prose-sm p-4">
	<h2>Conversations</h2>

	{#each conversations as conversation}
	{#if conversation.receiver.username === user.username}
	<a class="flex flex-row gap-4 items-center" href="/profile/{conversation.sender.username}/chat">
		<div class="avatar">
			<div class="w-12 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
				<img src={conversation.sender.avatar} class="rounded-full my-0">
			</div>
		</div>
		<div class="flex flex-col">
			<h2 class="m-0">{conversation.sender.first_name} {conversation.sender.last_name}</h2>
			<span>Joined <strong>{moment(conversation.sender.created_at).format("MMMM YYYY")}</strong></span>
		</div>
	</a>
	{:else}
	<a class="flex flex-row gap-4 items-center" href="/profile/{conversation.receiver.username}/chat">
		<div class="avatar">
			<div class="w-12 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
				<img src={conversation.receiver.avatar} class="rounded-full my-0">
			</div>
		</div>
		<div class="flex flex-col">
			<h2 class="m-0">{conversation.receiver.first_name} {conversation.receiver.last_name}</h2>
			<span>Joined <strong>{moment(conversation.receiver.created_at).format("MMMM YYYY")}</strong></span>
		</div>
	</a>
	{/if}
	{/each}
</div>
</div>
