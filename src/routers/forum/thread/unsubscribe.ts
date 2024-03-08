import { z } from "zod";
import { privateProcedure } from "../../middlewares/privateProcedure";
import { prisma } from "@lib/shared";
import { TRPCError } from "@trpc/server";

export const threadUnsubscribeProcedure = privateProcedure
	.input(
		z.object({
			uidThread: z.string().uuid()
		})
	)
	.output(z.void())
	.mutation(async ({ ctx, input }) => {
		// Check if the thread exists
		const thread = await prisma.thread.findUnique({
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

		// Check if the user is even subscribed to the thread
		const existingSubscription = await prisma.threadSubscription.findFirst({
			where: {
				user: {
					id: ctx.user.id
				},
				thread: {
					id: thread.id
				}
			}
		});

		if (!existingSubscription) {
			throw new TRPCError({
				code: "CONFLICT",
				message: "You were not subscribed to this thread",
			});
		}

		// Remove the subscription to the thread
		await prisma.threadSubscription.delete({
			where: {
				user_id_thread_id: {
					user_id: ctx.user.id,
					thread_id: thread.id
				}
			}
		})
	});
