<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { Editor } from "@tiptap/core";
	import StarterKit from "@tiptap/starter-kit";
	import Placeholder from "@tiptap/extension-placeholder";
	
	let element: HTMLDivElement;
	let editor: Editor;

	export let tiptap: any;

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

		tiptap = editor;
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

	<div bind:this={element} />


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