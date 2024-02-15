<script script lang="ts">
	import trpc from "../trpc";
	import type { inferProcedureOutput } from "@trpc/server";
	import type { AppRouter } from "../pages/api/trpc/[trpc]";


	// let messages: inferProcedureOutput<AppRouter["messages"]["getAll"]>[] = [];
	let conversations = []

	export let accessToken: string;

	(async () => {
		// messages = await trpc.messages.getAll.query({ accessToken });
		conversations = await trpc.messages.getConversations.query({ accessToken })
		trpc.messages.onReceive.subscribe(
			{ accessToken },
			{
				onData: (data) => {
					// messages.push(data);
					// messages = messages;
				},
				onStarted: async () => {
					// const response = await trpc.messages.send.mutate({
					// 	accessToken,
					// 	message: "Hello!",
					// 	recipient: 1,
					// });
				},
			}
		);
	})();
</script>

<div class="max-w-screen-xl w-full mx-auto">
	<h2>Conversations</h2>

	{#each conversations as conversation}
		<div>
			{conversation.receiver.first_name} {conversation.receiver.last_name}
		</div>
	{/each}
</div>
