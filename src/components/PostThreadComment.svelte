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
	<div class="flex flex-col md:flex-row w-full items-start">
		<Tiptap bind:tiptap={tiptapref}></Tiptap>
		<button class="btn btn-ghost ml-4" on:click={postComment}><PaperPlane size={20}></PaperPlane></button>
	</div>
</div>