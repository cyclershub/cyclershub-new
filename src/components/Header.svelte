<script lang="ts">
	import { HamburgerMenu } from "radix-svelte-icons";
	import ThemeController from "./ThemeController.svelte";

	
</script>

<nav class="navbar bg-base-100 border-b-2 border-b-base-200 h-20 sticky top-0 z-10">
	<div class="flex flex-row justify-between w-full mx-auto px-8">
		<a href="/" class="link link-hover text-xl hidden md:block">
			<img src="/images/logo.svg" width="96" alt="META">
		</a>
		<div class="md:hidden">
			<ThemeController></ThemeController>
		</div>
		<div class="flex-row items-center gap-8 hidden md:flex">
			<a href="/search" class="link link-hover">Search</a>
			<a href="/faq" class="link link-hover">FAQ</a>
			<a href="/forums" class="link link-hover">Forums</a>
			<a href="/about" class="link link-hover">About</a>
			{#if true}
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="avatar online">
						<div class="w-12 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
							<img src="https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg?size=338&ext=jpg&ga=GA1.1.87170709.1707782400&semt=ais" class="avatar online rounded-full w-12 h-12 object-cover">
						</div>
				</div>
				<ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
					<li><a href="/profile">My Profile</a></li>
					<li><a href="/profile/messages">Messages</a></li>
					<li><a href="/profile/settings">Settings</a></li>
					
				</ul>
			</div>
			{:else}
				<a href="/auth/signup" class="btn">Sign Up</a>
			{/if}
		</div>
		<div class="drawer w-auto md:hidden">
			<input id="header-drawer" type="checkbox" class="drawer-toggle" />
			<div class="drawer-content">
				<!-- Page content here -->
				<label for="header-drawer" class="btn btn-ghost drawer-button"><HamburgerMenu size={24}></HamburgerMenu></label>
			</div> 
			<div class="drawer-side">
				<label for="header-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
				<ul class="menu p-4 w-80 min-h-full bg-base-200 z-20 text-base-content">
					<li><a href="/playground" class="link link-hover">Playground</a></li>
					<li><a href="/community" class="link link-hover">Community</a></li>
					<li><a href="/about" class="link link-hover">About</a></li>
					<li><a href=""><img src="" class="avatar rounded-full"></a></li>
				</ul>
			</div>
		</div>
	</div>
</nav>