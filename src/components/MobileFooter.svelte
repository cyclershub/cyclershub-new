<script lang="ts">
	import type { User } from "@prisma/client";
	import { Globe, Home, Pencil2, Person, Plus } from "radix-svelte-icons";
	import { ripple } from "svelte-ripple-action";
	import { PaperPlane } from "radix-svelte-icons";
	import type { Editor } from "@tiptap/core";
	import TiptapRaw from "./TiptapRaw.svelte";
	
	let tiptapref: Editor;

	export let user: User | null;
	export let retractAddSign: boolean = false;
</script>

<div class="fixed bottom-0 left-0 w-full md:hidden h-12 z-10 bg-base-200 border-t border-t-black grid grid-cols-5 px-2 items-center justify-center">
	<button use:ripple class="w-full h-full flex items-center justify-center -translate-y-1">
		<a href="/"><Home size={24}></Home></a>
	</button>
	<button use:ripple class="w-full h-full flex items-center justify-center -translate-y-1">
		<a href="/search"><Globe size={24}></Globe></a>
	</button>
	<div class="dropdown dropdown-top">
		<div class="w-full flex items-center justify-center" role="button" tabindex="0">
			<button class="w-14 h-14 bg-base-100 rounded-t-full border border-black flex items-center justify-center transition-all"
				class:-translate-y-2={!retractAddSign}
				use:ripple>
				<Plus size={24}></Plus>
			</button>
		</div>
		{#if !retractAddSign}
		<ul tabindex="0" class="dropdown-content !bottom-[120%] left-[50%] translate-x-[-50%]  z-[1] menu p-2 shadow bg-base-100 rounded-box w-auto">
			<slot name="addOptions" />
		</ul>
		{/if}
	</div>
	<button use:ripple class="w-full h-full flex items-center justify-center -translate-y-1">
		<a href="/forums"><Pencil2 size={24}></Pencil2></a>
	</button>
	<div class="w-full h-full flex items-center justify-center -translate-y-1">
	{#if user}
		<div class="dropdown dropdown-top dropdown-left">
			<img src={user.avatar || "/images/default-avatar.svg"} class="w-9 h-9 rounded-full" role="button" tabindex="0">
			<ul tabindex="0" class="dropdown-content !bottom-[120%] z-[1] menu p-2 shadow bg-base-100 rounded-box w-36">
				<li class="text-center"><a>Profile</a></li>
				<li class="text-center"><a href="/auth/logout">Sign Out</a></li>
			</ul>
		</div>
	{:else}
		<a href="/auth/login"><Person size={24}></Person></a>
	{/if}
</div>
</div>