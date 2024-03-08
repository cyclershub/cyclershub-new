<script lang="ts">
	import trpc from "../trpc";

	async function signup() {
		if (password !== passwordRepeat) {
			alert("Passwords do not match");
			return;
		}

		const user = await trpc.user.create.mutate({
			email,
			password,
			first_name: firstName,
			last_name: lastName,
			username
		});

		if (!user) {
			alert("Failed to create user");
			return;
		}

		window.location.href = "/auth/login"
	}

	let email: string;
	let password: string;
	let firstName: string;
	let lastName: string;
	let passwordRepeat: string;
	let username: string;
</script>

<main
	class="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-sm w-full px-6"
>
	<h4>Sign Up</h4>
	<hr class="mb-8" />
	<div class="flex flex-row justify-between gap-4">
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text font-semibold">First Name</span>
			</div>
			<input
				type="text"
				placeholder="Joe"
				class="input input-bordered w-full"
				bind:value={firstName}
			/>
		</label>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text font-semibold">Last Name</span>
			</div>
			<input
				type="text"
				placeholder="Wellington"
				class="input input-bordered w-full"
				bind:value={lastName}
			/>
		</label>
	</div>
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">Username</span>
		</div>
		<input
			type="text"
			placeholder="joewellington123"
			class="input input-bordered w-full"
			bind:value={username}
		/>
	</label>
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">Email Address</span>
		</div>
		<input
			type="email"
			placeholder="your.email@address.com"
			class="input input-bordered w-full"
			bind:value={email}
		/>
	</label>
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">Password</span>
		</div>
		<input
			type="password"
			placeholder="********"
			class="input input-bordered w-full"
			bind:value={password}
		/>
	</label>
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">Repeat Password</span>
		</div>
		<input
			type="password"
			placeholder="********"
			class="input input-bordered w-full"
			bind:value={passwordRepeat}
		/>
	</label>
	<button class="btn w-full my-4" on:click={signup}>Sign Up</button>
	<div class="flex flex-row justify-between mt-4">
		<a href="/auth/login" class="text-xs">Already have an account?</a>
		<a href="/terms" class="text-xs">Terms of service</a>
	</div>
</main>
