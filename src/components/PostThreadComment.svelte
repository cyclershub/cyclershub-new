<script lang="ts">
	import type { Thread, User } from "@prisma/client";
	import Tiptap from "./Tiptap.svelte";
	import { ChevronRight, PaperPlane } from "radix-svelte-icons";

	export let thread: Thread;
	export let user: User;
</script>

<div class="bg-base-100 py-6">
	<div class="flex flex-row items-start">
		<div class="avatar mx-6">
			<div class="w-16 rounded-full">
				<img
					class="my-0"
					src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
				/>
			</div>
		</div>
		<Tiptap></Tiptap>
		<button class="btn btn-ghost ml-4"><PaperPlane size={20}></PaperPlane></button>
	</div>
</div>