<script lang="ts">
	import type { Thread, User } from "@prisma/client";
	import Tiptap from "./Tiptap.svelte";
	import { ChevronRight, PaperPlane } from "radix-svelte-icons";
	import type { Editor } from "@tiptap/core";
	import trpc from "../trpc";

	export let thread: Thread;
	export let user: User;

	let tiptapref: Editor;

	async function postComment() {
		const html = tiptapref.getHTML();

		const { uid } = await trpc.forum.createPost.mutate({
			message: html,
			uidThread: thread.uid,
		})

		tiptapref.commands.clearContent();
	}
</script>

<div class="bg-base-100 py-6">
	<div class="flex flex-row items-start">
		<div class="avatar mx-6">
			<div class="w-16 rounded-full">
				<img
					class="my-0"
					src={user.avatar}
				/>
			</div>
		</div>
		<Tiptap bind:tiptap={tiptapref}></Tiptap>
		<button class="btn btn-ghost ml-4" on:click={postComment}><PaperPlane size={20}></PaperPlane></button>
	</div>
</div>