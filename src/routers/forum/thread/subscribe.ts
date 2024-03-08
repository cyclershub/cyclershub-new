import { z } from "zod";
import { privateProcedure } from "../../middlewares/privateProcedure";
import { prisma } from "@lib/shared";
import { TRPCError } from "@trpc/server";
import { v4 } from "uuid";

export const threadSubscribeProcedure = privateProcedure
	.input(
		z.object({
			uidThread: z.string().uuid()
		})
	)
	.output(z.object({ uid: z.string().uuid() }))
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

		// Check if the user is already subscribed to the thread
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

		if (existingSubscription) {
			throw new TRPCError({
				code: "CONFLICT",
				message: "You are already subscribed to this thread",
			});
		}

		const uid = v4();

		// Create a subscription to the thread
		const subscription = await prisma.threadSubscription.create({
			data: {
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
		})

		return { uid: subscription.uid };
	});
