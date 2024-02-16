<script lang="ts">
	import type { Review, User } from "@prisma/client";
	import moment from "moment";
	import { DiscordLogo, GithubLogo, InstagramLogo, TwitterLogo } from 'radix-svelte-icons';
	import LocationMap from "../components/LocationMap.svelte";

	export let reviews: Review[] = [];
	export let profile: User;
</script>

<div class="relative min-h-screen">
	<img class="w-full h-[400px] object-cover my-0" src={profile.banner} alt="">
	<div class="max-w-screen-xl mx-auto w-full relative">
		<div class="avatar absolute -bottom-36 my-0 left-0">
			<div class="w-72 rounded-full ring-2 ring-primary ring-offset-transparent ring-offset-2">
				<img class="object-cover my-0" src={profile.avatar} />
			</div>
		</div>
	</div>
	<div class="max-w-screen-xl mx-auto w-full relative pl-80 my-8">
		<h2 class="my-0">{profile.first_name} {profile.last_name}</h2>
		<span class="text-base">Joined {moment(profile.created_at).format("MMMM DD YYYY")}</span>
		<p class="text-lg my-4">{profile.biography}</p>
		<div class="flex flex-row gap-4 my-4">
			<a href="/profile/{profile.username}/chat" class="btn no-underline">Send Message</a>
			<a class="btn btn-square"><TwitterLogo size={24} /></a>
			<a class="btn btn-square"><InstagramLogo size={24} /></a>
			<a class="btn btn-square"><GithubLogo size={24} /></a>
			<a class="btn btn-square"><DiscordLogo size={24} /></a>
		</div>
	</div>
	<div class="max-w-screen-xl mx-auto w-full relative my-8 h-[600px] prose prose-sm">
		<div class="grid grid-cols-[2fr,4fr] h-full">
			<div>
				<h3 class="my-0">Location</h3>
				<p>{profile.address}, {profile.zip} {profile.city}</p>
				<h3>Amenities</h3>
				<ul>
					<li>Wifi</li>
					<li>Electricity</li>
					<li>Water</li>
					<li>Restrooms</li>
				</ul>
			</div>
			<LocationMap location={{lat: profile.lat || 0, lng: profile.lng || 0 }} />
		</div>
	</div>
	<div class="max-w-screen-xl mx-auto w-full relative my-8 prose prose-sm">
		<hr>
		{#each reviews as review}
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
	</div>
</div>