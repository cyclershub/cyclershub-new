import { z } from "zod";
import { privateProcedure } from "../middlewares/privateProcedure";
import { prisma } from "../../lib/shared";
import { TRPCError } from "@trpc/server";
import { v4 } from "uuid";

export const createPostProcedure = privateProcedure
	.input(
		z.object({
			uidThread: z.string().uuid(),
			message: z.string()
		})
	)
	.output(z.object({ uid: z.string().uuid() }))
	.mutation(async ({ ctx, input }) => {
		// Check if the thread exists
		const thread = await prisma.thread.findFirst({
			where: {
				uid: input.uidThread,
			},
		});

		if (!thread) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Thread not found",
			});
		}

		const uid = v4();

		// Create the thread
		const post = await prisma.post.create({
			data: {
				message: input.message,
				thread: {
					connect: {
						uid: input.uidThread,
					},
				},
				user: {
					connect: {
						id: ctx.user.id
					}
				},
				uid
			},
		});

		return { uid: post.uid };
	});
