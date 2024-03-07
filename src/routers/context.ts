import { initTRPC } from "@trpc/server";
import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import type { AstroGlobal } from "astro";

export async function createContext(opts: CreateWSSContextFnOptions | CreateHTTPContextOptions) {
	return {
		authorization: opts.req?.headers.authorization ?? null
	}
}

export function createContextInner(astro: AstroGlobal) {
	return {
		authorization: astro.cookies.get("authorization")?.value ?? null
	}
}

export const t = initTRPC.context<typeof createContext>().create();