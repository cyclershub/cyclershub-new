import { initTRPC } from "@trpc/server";
import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";

export async function createContext(opts: CreateHTTPContextOptions) {
	return {
		authorization: opts.req?.headers.authorization ?? null
	}
}

export const t = initTRPC.context<typeof createContext>().create();