<script lang="ts">
	import type { Review, User } from "@prisma/client";
	import moment from "moment";
	import { InstagramLogo, ChatBubble } from "radix-svelte-icons"
	import {EnvelopeOpen} from "radix-svelte-icons";

	export let focused: User & { incoming_reviews: (Review & {create_user: User})[] };
	export let visible: boolean = false;
</script>

{#if visible}
<div class="fixed top-[80px] left-0 w-[400px] h-full bg-base-100 z-[50000] border-r-2 border-r-base-200 prose prose-sm p-4">
	<div class="flex flex-row gap-4 items-center">
		<div class="avatar">
			<div class="w-12 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
				<img src={focused.avatar} class="rounded-full my-0">
			</div>
		</div>
		<div class="flex flex-col">
			<h2 class="m-0">{focused.first_name} {focused.last_name}</h2>
			<span>Joined <strong>{moment(focused.created_at).format("MMMM YYYY")}</strong></span>
		</div>
	</div>
	<p>{focused.biography}</p>

	<div class="flex gap-4">
		<a class="btn no-underline" href="/profile/{focused.username}/chat"><ChatBubble size={20} /> Send Message</a>
		<button class="btn btn-square p-1" title="Instagram"><InstagramLogo size={20} /></button>
		<button class="btn btn-square p-1" title="Email"><EnvelopeOpen size={20} /></button>
	</div>

	<h2>Reviews</h2>
	<hr class="my-4">
	{#if focused.incoming_reviews.length == 0}
		<p>Sorry. This member does not have any reviews yet.</p>
	{:else}
		{#each focused.incoming_reviews as review}
			<div>
				<div class="flex flex-row gap-4 items-center">
					<a class="avatar" href="/profile/{review.create_user.id}">
						<div class="w-12 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
							<img src={review.create_user.avatar} class="rounded-full my-0">
						</div>
					</a>
					<div class="flex flex-col">
						<div class="rating rating-sm">
							<input type="radio" name="rating-2" disabled class="mask mask-star-2 bg-orange-400" checked={review.rating == 1} />
							<input type="radio" name="rating-2" disabled class="mask mask-star-2 bg-orange-400" checked={review.rating == 2} />
							<input type="radio" name="rating-2" disabled class="mask mask-star-2 bg-orange-400" checked={review.rating == 3} />
							<input type="radio" name="rating-2" disabled class="mask mask-star-2 bg-orange-400" checked={review.rating == 4} />
							<input type="radio" name="rating-2" disabled class="mask mask-star-2 bg-orange-400" checked={review.rating == 5} />
						</div>
						<h3 class="m-0">{review.create_user.first_name} {review.create_user.last_name}</h3>
						<span>Reviewed on {moment(review.created_at).format("MMMM DD YYYY")}</span>
					</div>
				</div>
				<p>{review.review}</p>
			</div>
		{/each}
	{/if}
</div>
{/if}