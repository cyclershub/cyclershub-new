<script lang="ts">
	import { Bell } from "radix-svelte-icons";
	import trpc from "../trpc";
	import Cookies from "js-cookie";
</script>

<nav
	class="navbar bg-base-100 border-b-2 border-b-base-200 h-20 sticky top-0 z-10"
>
	<div class="max-w-screen-2xl w-full mx-auto flex flex-row justify-between">
		<div class="flex flex-row gap-8 items-center">
			<a href="/" class="link link-hover text-xl hidden md:block">
				<img src="/images/logo.svg" width="96" alt="META">
			</a>
			<a href="/forums">News</a>
			<a href="/forums/rules">Rules</a>
			<a href="/forums">Forums</a>
		</div>
		<div class="flex flex-row items-center gap-4">
			{#if Cookies.get("accessToken")}
			{#await trpc.user.getSelf.query()}
				<div class="w-12 h-12 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2 skeleton"></div>
			{:then user}
			<div class="dropdown dropdown-end">
				<button tabindex="0" class="btn btn-ghost btn-square">
					<Bell size={24} />
				</button>
				<ul tabindex="0" class="dropdown-content z-[1] menu p-4 shadow bg-base-100 rounded-box w-72">
					<p>There are no new notifications!</p>
				</ul>
			</div>
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="avatar">
						<div class="w-12 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
							<img src={user.avatar} class="avatar rounded-full w-12 h-12 object-cover">
						</div>
				</div>
				<ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
					<li><a href="/profile">My Profile</a></li>
					<li><a href="/profile/messages">Messages</a></li>
					<li><a href="/profile/settings">Settings</a></li>
					<li><a href="/auth/logout">Log Out</a></li>
				</ul>
			</div>
			{:catch}
				<a href="/auth/signup" class="btn">Sign Up</a>
			{/await}
			{:else}
				<a href="/auth/signup" class="btn">Sign Up</a>
			{/if}
		</div>
	</div>
</nav>
