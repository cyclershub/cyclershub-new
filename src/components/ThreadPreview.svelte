<script lang="ts">
	import type { Thread, User } from "@prisma/client";
	import moment from "moment";
	import { ChatBubble } from "radix-svelte-icons";
	import { ripple } from "svelte-ripple-action";

	export let forumName: string;
	export let thread: Thread & { user: User, _count: { posts: number }};
</script>

<a class="bg-base-200 p-6 rounded-lg w-full flex flex-col gap-4 no-underline cursor-pointer" use:ripple href={`/forums/${forumName}/${thread.slug}`}>
	<div class="flex flex-row justify-between">
		<div class="flex flex-row gap-2 items-center">
			<div class="avatar">
				<div class="w-12 rounded-full">
					<img
						class="my-0"
						src={thread.user.avatar || "/images/default-avatar.svg"}
					/>
				</div>
			</div>
			<div class="flex flex-col">
				<span>{thread.user.username}</span>
				<span class="text-base-content text-xs opacity-55">{moment(thread.created_at).format("MMMM DD Y")}</span>
			</div>
		</div>
		<div class="flex flex-row gap-2 items-center">
			<ChatBubble size={20} />
			<span class="text-sm opacity-80">{thread._count.posts}</span>
		</div>
	</div>
	<div>
		<div class="flex flex-col">
			<h3 class="font-bold text-base-content text-lg my-0 mb-2 leading-5">
				{thread.title}
			</h3>
			<p class="text-sm opacity-80 line-clamp-6">{thread.description}</p>
		</div>
	</div>
</a>