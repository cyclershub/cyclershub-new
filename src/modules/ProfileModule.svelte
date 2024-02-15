<script lang="ts">
	import type { Review, User } from "@prisma/client";
	import moment from "moment";
	import { DiscordLogo, GithubLogo, InstagramLogo, TwitterLogo } from 'radix-svelte-icons';
	import LocationMap from "../components/LocationMap.svelte";

	export let reviews: Review[] = [];
	export let profile: User;
</script>

<div class="relative min-h-screen">
	<img class="w-full h-[400px] object-cover my-0" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/cebd17f1-b283-45e5-8600-6ec3edc558fd/dee2aqv-222532a7-8676-4788-b8e3-08d4f5be55e2.png/v1/fill/w_1280,h_640,q_80,strp/profile_banner_by_darkfigure4_dee2aqv-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjQwIiwicGF0aCI6IlwvZlwvY2ViZDE3ZjEtYjI4My00NWU1LTg2MDAtNmVjM2VkYzU1OGZkXC9kZWUyYXF2LTIyMjUzMmE3LTg2NzYtNDc4OC1iOGUzLTA4ZDRmNWJlNTVlMi5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.sdy7FtZ92V4tHXX-hTf0PupZmkD7CQoG-BkmOY0_mQg" alt="">
	<div class="max-w-screen-xl mx-auto w-full relative">
		<div class="avatar absolute -bottom-36 my-0 left-0">
			<div class="w-72 rounded-full ring-2 ring-primary ring-offset-transparent ring-offset-2">
				<img class="object-cover my-0" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
			</div>
		</div>
	</div>
	<div class="max-w-screen-xl mx-auto w-full relative pl-80 my-8">
		<h2 class="my-0">{profile.first_name} {profile.last_name}</h2>
		<span class="text-base">Joined {moment(profile.created_at).format("MMMM DD YYYY")}</span>
		<p class="text-lg my-4">{profile.profile_description}</p>
		<div class="flex flex-row gap-4 my-4">
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
					<a class="avatar online" href="/profile/{review.create_user.id}">
						<div class="w-12 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
							<img src={review.create_user.profile_picture} class="rounded-full my-0">
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