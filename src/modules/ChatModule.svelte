<script lang="ts">
	import type { User } from "@prisma/client";
	import trpc from "../trpc";
	import Cookies from "js-cookie";
	import type { inferProcedureOutput } from "@trpc/server";
	import type { AppRouter } from "../pages/api/trpc/[trpc]";
	import moment from "moment";
	import { PaperPlane} from "radix-svelte-icons"
	
	export let recipient: User;

	const accessToken = Cookies.get("accessToken") as string;

	let conversation: inferProcedureOutput<
		AppRouter["messages"]["getConversationMessages"]
	> = [];

	(async () => {
		conversation = await trpc.messages.getConversationMessages.query({
			accessToken,
			recipientUsername: recipient.username,
		});
	})();

	let message: string;

	async function send() {
		await trpc.messages.send.mutate({
			accessToken,
			recipientUsername: recipient.username,
			message
		})

		message = "";
	}

	trpc.messages.onReceive.subscribe({ accessToken }, {
		onData: (data) => {
			conversation = [...conversation, data].sort((a, b) => {
				return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
			})
		}
	})
</script>

	<div class="max-w-screen-xl mx-auto w-full relative my-8 prose prose-sm">
		<div class="flex flex-row gap-4 items-center mb-8">
			<div class="avatar">
				<div class="w-12 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
					<a href="/profile/{recipient.username}"><img src={recipient.avatar} class="rounded-full my-0"></a>
				</div>
			</div>
			<div class="flex flex-col">
				<h2 class="m-0">{recipient.first_name} {recipient.last_name}</h2>
				<span class="text-xs font-semibold">&lt;{recipient.email}&gt; &lt;{recipient.username}@cyclershub.com&gt;</span>
			</div>
		</div>
		<div class="max-h-[50vh] overflow-y-auto flex flex-col-reverse border border-base-300 rounded-lg p-4">
			{#each conversation.reverse() as message}
			<div
				class="chat"
				class:chat-start={message.sender.username ===
					recipient.username}
				class:chat-end={message.sender.username !== recipient.username}
			>
				<div class="chat-image avatar">
					<div class="w-10 rounded-full">
						<img
							class="my-0"
							alt=""
							src={message.sender.avatar}
						/>
					</div>
				</div>
				<div class="chat-header">
					{message.sender.username}
				</div>
				<div class="chat-bubble" class:chat-bubble-primary={message.sender.username !== recipient.username}>
					{message.message}
				</div>
				<time class="chat-footer text-xs opacity-50"
					>{moment(message.created_at).format(
						"MMM DD YYYY HH:mm"
					)}</time
				>
			</div>
		{/each}
		</div>
		<div class="flex flex-row gap-4 mt-12">
			<textarea placeholder="Message..." class="textarea textarea-bordered w-full" on:keydown={(e) => {
				if (e.key === "Enter") {
					send();
				}
			}} bind:value={message}></textarea>
			<button class="btn" on:click={send}><PaperPlane size={20} /></button>
		</div>
	</div>