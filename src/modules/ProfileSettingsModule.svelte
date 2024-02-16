<script lang="ts">
	import type { User } from "@prisma/client";
	import countries from "../lib/countries.json";
	import amenities from "../lib/amenities.json";
	import LocationMap from "../components/LocationMap.svelte";
	import { Person, EnvelopeClosed, Camera } from "radix-svelte-icons"
	import trpc from "../trpc"
	
	export let profile: User;

	async function uploadBanner(e: Event & {
		target: HTMLInputElement & { files: FileList }
	}) {
		const image = e.target.files[0];
		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = async (readEvent) => {
			const url = readEvent.target?.result as string;

			// Update the profile banner
			const {uid} = await trpc.images.upload.mutate({
				dataUrl: url
			})

			profile.banner = "/api/image/" + uid;
		};
	}

	async function update() {
		const response = await trpc.user.update.mutate({
			first_name: profile.first_name,
			last_name: profile.last_name,
			email: profile.email,
			username: profile.username,
			country: profile.country,
			state: profile.state,
			city: profile.city,
			zip: profile.zip,
			address: profile.address,
			avatar: profile.avatar,
			banner: profile.banner,
			available_to_host: profile.available_to_host,
			biography: profile.biography,
			lat: profile.lat,
			lng: profile.lng,
			phone_number: profile.phone_number,
			// amenities: profile.amenities
		})

		profile.lat = response.geocoding.lat;
		profile.lng = response.geocoding.lng;

		profile = profile

		updateLocation({ lat: profile.lat || 0, lng: profile.lng || 0 })
	
	}

	let updateLocation: (location: { lat: number, lng: number }) => void;

	let bannerFileInput: HTMLInputElement;
</script>

<div class="min-h-screen mx-auto max-w-screen-xl my-8 grid grid-cols-[1fr_3fr] gap-4">
	<div class="border border-base-300 rounded-lg p-4 gap-2 flex flex-col">
		<a href="" class="flex flex-row gap-4 items-center text-lg no-underline btn btn-ghost justify-start">
			<Person size={24} />
			Profile
		</a>
		<a href="" class="flex flex-row gap-4 items-center text-lg no-underline btn btn-ghost justify-start">
			<EnvelopeClosed size={24} />
			Messages
		</a>
	</div>
	<div class="border border-base-300 rounded-lg">
		<div class="relative">
			<button class="relative group cursor-pointer h-72 w-full" on:click={() => {
				bannerFileInput.click()
			}}>
				<img src={profile.banner} class="my-0 rounded-tr-lg rounded-tl-lg group-hover:brightness-50 transition-all h-72 w-full object-cover">
				<div class="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] opacity-0 group-hover:opacity-100 transition-opacity">
					<Camera size={72} color="#aaa" />
				</div>
				<input type="file" class="hidden" on:change={uploadBanner} bind:this={bannerFileInput}>
			</button>
			<img src={profile.avatar} class="my-0 rounded-full w-56 h-56 object-cover absolute left-[50%] bottom-0 translate-x-[-50%] translate-y-[50%] border-4 border-primary">
		</div>
		<div class="p-4">
			<h4 class="mt-24">Personal Details</h4>
		<div class="flex flex-row gap-4">
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text font-semibold">First Name</span>
				</div>
				<input type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={profile.first_name} />
			</label>
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text font-semibold">Last Name</span>
				</div>
				<input type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={profile.last_name} />
			</label>
		</div>
		<div class="flex flex-row gap-4">
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text font-semibold">Email</span>
				</div>
				<input type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={profile.email} />
			</label>
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text font-semibold">Username</span>
				</div>
				<input type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={profile.username} />
			</label>
		</div>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text font-semibold">Biography</span>
			</div>
			<textarea class="textarea textarea-bordered w-full" placeholder="Write ahead..." cols="30" rows="10" bind:value={profile.biography}></textarea>
		</label>
		<h4>Location</h4>
		<div class="flex flex-row gap-4">
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Country</span>
				</div>
				<select class="select select-bordered" on:change={(e) => {
					profile.country = e.target.value;
				}}>
					{#each countries as { name, code } }
						<option value={code} selected={profile.country === code}>{name}</option>
					{/each}
				</select>
			</label>
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text font-semibold">State</span>
				</div>
				<input type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={profile.state} />
			</label>
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text font-semibold">City</span>
				</div>
				<input type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={profile.city} />
			</label>
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text font-semibold">ZIP Code</span>
				</div>
				<input type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={profile.zip} />
			</label>
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text font-semibold">Address</span>
				</div>
				<input type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={profile.address} />
			</label>
		</div>
		<div class="h-96 w-full mt-4">
			<LocationMap location={{lat: profile.lat || 0, lng: profile.lng || 0 }} bind:updateLocation />
		</div>
		<h4>Hosting Amenities</h4>
		<div class="flex flex-row flex-wrap gap-4">
			{#each amenities as amenity}
				<div class="form-control">
					<label class="label cursor-pointer items-center gap-2">
						<input type="checkbox" checked={amenity.db} class="checkbox checkbox-xs" />
						<div class="tooltip h-11" data-tip={amenity.description}>
							<span class="label-text">{amenity.name}</span>
						</div>
					</label>
				</div>
			{/each}
		</div>
		<div class="flex flex-row justify-end mt-12">
			<button class="btn btn-success text-white" on:click={update}>Save Changes</button>
		</div>
		</div>
	</div>
</div>