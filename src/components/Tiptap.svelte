<script>
	import { onMount, onDestroy } from "svelte";
	import { Editor } from "@tiptap/core";
	import StarterKit from "@tiptap/starter-kit";
	import Placeholder from "@tiptap/extension-placeholder";
	import {FontBold, FontItalic, FontRoman} from "radix-svelte-icons";

	let element;
	let editor;

	Placeholder.configure({
		placeholder: "Write something...",
	})

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [StarterKit, Placeholder],
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			},
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div class="flex flex-col border border-black rounded-sm w-full">
	<div class="border-b border-b-black px-4 py-2">
		{#if editor}
			<button
				on:click={() =>
					editor.chain().focus().toggleBold().run()}
				class:active={editor.isActive("bold")}
				class="btn btn-square w-6 h-6 btn-ghost"
			>
				<FontBold size={16}></FontBold>
			</button>
			<button
				on:click={() =>
					editor.chain().focus().toggleItalic().run()}
				class:active={editor.isActive("italic")}
				class="btn btn-square w-6 h-6 btn-ghost btn-active"
			>
				<FontItalic size={16}></FontItalic>
			</button>
			<button
				on:click={() => editor.chain().focus().setParagraph().run()}
				class:active={editor.isActive("paragraph")}
			>
				<FontRoman size={16}></FontRoman>
			</button>
		{/if}
	</div>

	<div class="bg-base-100 px-6 outline-none" bind:this={element} />
</div>


<style>
	:global(.tiptap.ProseMirror-focused) {
		outline: none;
	}

	:global(.tiptap p.is-editor-empty:first-child::before) {
		@apply text-base-content opacity-50;
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}
</style>