<script>
	import {GithubLogo} from "radix-svelte-icons";
	import {TwitterLogo} from "radix-svelte-icons";

</script>

<div class="mt-auto">
	<footer class="p-10 bg-base-200 text-base-content">
		<div class="footer max-w-screen-xl mx-auto">
			<nav>
				<header class="footer-title">Features</header> 
				<a class="link link-hover" href="/search">Find Hosts</a>
				<a class="link link-hover" href="/tours">Tours</a>
				<a class="link link-hover" href="/guides">Guides</a>
				<a class="link link-hover" href="/setups">Explore Setups</a>
			</nav> 
			<nav>
				<header class="footer-title">The CyclersHub</header> 
				<a class="link link-hover" href="/about">About us</a>
				<a class="link link-hover" href="/contact">Contact</a>
			</nav> 
			<nav>
				<header class="footer-title">Legal</header> 
				<a class="link link-hover" href="/terms-of-use">Terms of use</a>
				<a class="link link-hover" href="/privacy-policy">Privacy policy</a>
				<a class="link link-hover" href="/cookie-policy">Cookie policy</a>
			</nav>
		</div>
	</footer> 
	<footer class="py-4 border-t bg-base-200 text-base-content border-base-300">
		<div class="footer max-w-screen-xl mx-auto">
			<aside class="items-center grid-flow-col">
				<img src="/images/logo.svg" width="100">
				<p>The CyclersHub <br/>Connecting people on two wheels.</p>
			</aside> 
			<nav class="md:place-self-center md:justify-self-end">
				<div class="grid grid-flow-col gap-4">
					<a href=""><TwitterLogo size={24} /></a>
					<a href="https://github.com/cyclershub" target="_blank"><GithubLogo size={24} /></a>
				</div>
			</nav>
		</div>
	</footer>
</div>