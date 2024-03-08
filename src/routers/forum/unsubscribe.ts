import { z } from "zod";
import { privateProcedure } from "../middlewares/privateProcedure";
import { prisma } from "@lib/shared";
import { TRPCError } from "@trpc/server";

export const forumUnsubscribeProcedure = privateProcedure
	.input(
		z.object({
			uidThread: z.string().uuid()
		})
	)
	.output(z.void())
	.mutation(async ({ ctx, input }) => {
		// Check if the forum exists
		const forum = await prisma.forum.findUnique({
			where: {
				uid: input.uidThread,
			},
		});

		if (!forum) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Thread not found",
			});
		}

		// Check if the user is even subscribed to the forum
		const existingSubscription = await prisma.forumSubscription.findFirst({
			where: {
				user: {
					id: ctx.user.id
				},
				forum: {
					id: forum.id
				}
			}
		});

		if (!existingSubscription) {
			throw new TRPCError({
				code: "CONFLICT",
				message: "You were not subscribed to this forum",
			});
		}

		// Remove the subscription to the forum
		await prisma.forumSubscription.delete({
			where: {
				user_id_forum_id: {
					user_id: ctx.user.id,
					forum_id: forum.id
				}
			}
		})
	});
