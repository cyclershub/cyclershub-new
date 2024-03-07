<script script lang="ts">
	import type { User } from "@prisma/client";
	import Cookies from "js-cookie";
	import trpc from "../trpc";
	import type { inferProcedureOutput } from "@trpc/server";
	import type { AppRouter } from "../routers";
	
	let conversations: inferProcedureOutput<AppRouter["messages"]["getConversations"]> = []

	export let user: User;

	const accessToken = Cookies.get("accessToken") as string;

	(async () => {
		conversations = await trpc.messages.getConversations.query({ accessToken })
	})()
</script>

<div class="max-w-screen-xl w-full mx-auto h-screen">
	<h2>Conversations</h2>

	<div class="grid grid-cols-[1fr_2fr] w-full gap-4">
		<div class="border border-base-300 rounded-lg p-4 bg-base-200 flex flex-col gap-4">
			{#each conversations as conversation}
				{#if conversation.receiver.username === user.username}
					<a class="flex flex-row gap-4 items-center" href="/profile/{conversation.sender.username}/chat">
						<div class="avatar">
							<div class="w-10 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
								<img src={conversation.sender.avatar} class="rounded-full my-0">
							</div>
						</div>
						<span class="m-0 text-base">{conversation.sender.first_name} {conversation.sender.last_name}</span>
					</a>
				{:else}
					<a class="flex flex-row gap-4 items-center" href="/profile/{conversation.receiver.username}/chat">
						<div class="avatar">
							<div class="w-10 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
								<img src={conversation.receiver.avatar} class="rounded-full my-0">
							</div>
						</div>
						<span class="m-0 text-base">{conversation.receiver.first_name} {conversation.receiver.last_name}</span>
					</a>
				{/if}
			{/each}
		</div>
		<div class="border border-base-300 rounded-lg p-4 bg-base-200">
			
		</div>
</div>
</div>
