<script lang="ts">
	import trpc from "../trpc";
	import Cookies from "js-cookie";
	import type { User } from "@prisma/client";

	export let recipient: User;
	export let accessToken: string;

	async function send() {
		const response = await trpc.messages.send.mutate({
			recipient: recipient.username,
			accessToken,
			message,
			subject
		})
	}

	let subject: string = "";
	let message: string = "";
</script>

<div class="relative min-h-screen">
	<div class="max-w-screen-sm mx-auto w-full relative my-8 prose prose-sm">
		<h1>Send a new Message</h1>
		<div class="flex flex-row gap-4 items-center">
			<div class="avatar">
				<div class="w-12 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
					<img src={recipient.avatar} class="rounded-full my-0">
				</div>
			</div>
			<div class="flex flex-col">
				<h2 class="m-0">{recipient.first_name} {recipient.last_name}</h2>
				<span class="text-xs font-semibold">&lt;{recipient.email}&gt; &lt;{recipient.username}@cyclershub.com&gt;</span>
			</div>
		</div>
		<div>
			<h4>Subject</h4>
			<input type="text" placeholder="Subject" class="input input-bordered w-full" bind:value={subject}>
		</div>
		<div>
			<h4>Message</h4>
			<textarea cols="30" rows="10" class="textarea  textarea-bordered w-full" placeholder="Your Message..." maxlength="2500" bind:value={message}></textarea>
			<span>{message.length}/2500</span>
		</div>
		<button class="btn mt-4" on:click={send}>Send</button>
	</div>
</div>