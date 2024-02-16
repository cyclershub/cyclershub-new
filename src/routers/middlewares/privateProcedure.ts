import { TRPCError } from "@trpc/server";
import { t } from "../context"
import { validateAuthorization } from "../../lib/validateAuthorization";

export const privateProcedure = t.procedure.use(async (opts) => {
	const user = await validateAuthorization(opts.ctx.authorization as string)

	if (!user) {
		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
	}

	return opts.next({
		ctx: {
			user
		}
	})
})