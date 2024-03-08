import { z } from "zod";
import { privateProcedure } from "../middlewares/privateProcedure";
import { prisma } from "@lib/shared";
import { TRPCError } from "@trpc/server";
import { v4 } from "uuid";

export const createPostProcedure = privateProcedure
	.input(
		z.object({
			uidForum: z.string().uuid()
		})
	)
	.output(z.object({ uid: z.string().uuid() }))
	.mutation(async ({ ctx, input }) => {
		// Check if the forum exists
		const forum = await prisma.forum.findUnique({
			where: {
				uid: input.uidForum,
			},
		});

		if (!forum) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Thread not found",
			});
		}

		// Check if the user is already subscribed to the thread
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

		if (existingSubscription) {
			throw new TRPCError({
				code: "CONFLICT",
				message: "You are already subscribed to this forum",
			});
		}

		const uid = v4();

		// Create a subscription to the thread
		const subscription = await prisma.forumSubscription.create({
			data: {
				forum: {
					connect: {
						uid: input.uidForum,
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
