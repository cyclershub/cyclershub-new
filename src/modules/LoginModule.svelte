<script lang="ts">
	import trpc from "../trpc";
	import Cookies from "js-cookie"

	async function login() {
		const refreshTokenRequest = await trpc.user.getRefreshToken.query({
			email,
			password,
		});
		if (!refreshTokenRequest.refreshToken) {
			alert("Invalid email or password");
			return;
		}

		Cookies.set("refreshToken", refreshTokenRequest.refreshToken, {
			expires: 7,
		})

		const accessTokenRequest = await trpc.user.getAccessToken.query({
			refreshToken: refreshTokenRequest.refreshToken,
		});

		if (!accessTokenRequest.accessToken) {
			alert("Invalid email or password");
			return;
		}

		Cookies.set("accessToken", accessTokenRequest.accessToken, {
			expires: 7,
		})


		location.href = "/profile";
	}

	let email: string;
	let password: string;
</script>

<main class="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-sm">
	<h4>Login</h4>
	<hr class="mb-8">
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">Email Address</span>
		</div>
		<input type="email" placeholder="your.email@address.com" name="email" class="input input-bordered w-full" bind:value={email} />
	</label>
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">Password</span>
		</div>
		<input type="password" placeholder="********" name="password" class="input input-bordered w-full" bind:value={password} />
	</label>
	<button class="btn w-full my-4" on:click={login}>Login</button>
	<div class="flex flex-row justify-between mt-4">
		<a href="/auth/signup" class="text-xs">Sign up instead</a>
		<a href="/terms" class="text-xs">Terms of service</a>
	</div>
</main>