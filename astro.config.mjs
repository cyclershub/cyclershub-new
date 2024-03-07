import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), svelte()],
  output: "server",
  adapter: node({
    mode: "middleware"
  }),
	vite: {
		optimizeDeps: {
			// Avatars is not compatible with Vite since `sharp` uses .node imports that vite doesn't support.
			exclude: ["@continuum-ai/avatars"]
		}
	}
});