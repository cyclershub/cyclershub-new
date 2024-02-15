import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { APIRoute } from "astro";
import { router } from "../../../routers";

// The Astro API route, handling all incoming HTTP requests.
export const ALL: APIRoute = ({ request }) => {
	return fetchRequestHandler({
		req: request,
		endpoint: "/api/trpc",
		router,
	});
};

export type AppRouter = typeof router;
