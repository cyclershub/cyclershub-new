<script lang="ts">
	import type { User } from "@prisma/client";
	import { PaperPlane, Pencil1, Link2, Trash } from "radix-svelte-icons";
	import MobileFooter from "./MobileFooter.svelte";
	import TiptapRaw from "./TiptapRaw.svelte";
	import type { Editor } from "@tiptap/core";

	let tiptapref: Editor;

	export let user: User | null;
	export let showCommentInput: boolean = false;
</script>

{#if showCommentInput}
	<div
		class="bg-base-100 px-6 py-4 fixed bottom-12 z-50 w-full border-t border-t-black"
	>
		<div class="grid grid-cols-[auto_50px] w-full justify-between">
			<div class="w-full overflow-y-auto max-h-96">
				<TiptapRaw bind:tiptap={tiptapref}></TiptapRaw>
			</div>
			<div class="flex flex-col gap-2">
				<button class="btn btn-ghost p-2"
				><PaperPlane size={20}></PaperPlane></button
			>
			<button class="btn btn-ghost p-2" on:click={() => {
				tiptapref.commands.clearContent();
				showCommentInput = false;
			}}>
				<Trash size={20}></Trash>
			</button>
			</div>
		</div>
	</div>
{/if}

<MobileFooter {user} retractAddSign={showCommentInput}>
	<div slot="addOptions" class="flex flex-row">
		<li class="text-center"><button on:click={() => {
			showCommentInput = true;
		}}><Pencil1 size={20}></Pencil1></button></li>
		<li class="text-center"><a><Link2 size={20}></Link2></a></li>
	</div>
</MobileFooter>
