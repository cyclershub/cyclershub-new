import { z } from "zod";
import { privateProcedure } from "../middlewares/privateProcedure";
import slugify from "slugify";
import { prisma } from "../../lib/shared";
import { TRPCError } from "@trpc/server";
import { v4 } from "uuid";

export const createThreadProcedure = privateProcedure
	.input(
		z.object({
			forum: z.string().uuid(),
			title: z.string(),
			description: z.string(),
		})
	)
	.output(z.object({ uid: z.string().uuid() }))
	.mutation(async ({ ctx, input }) => {
		// Create a slug based off the title
		let slug = slugify(input.title);

		// Check if the forum exists
		const forum = await prisma.forum.findFirst({
			where: {
				uid: input.forum,
			},
		});

		if (!forum) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Forum not found",
			});
		}

		// Check if a thread with this slug already exists in the forum
		// if so, we can modify the slug by adding some random characters at the end
		// to make it unique
		const existingThread = await prisma.thread.findFirst({
			where: {
				slug,
				forum: {
					id: forum.id
				},
			}
		})

		if (existingThread) {
			const random = Math.random().toString(36).substring(7);
			slug += `-${random}`;
		}

		const uid = v4();

		// Create the thread
		const thread = await prisma.thread.create({
			data: {
				title: input.title,
				description: input.description,
				user: {
					connect: {
						id: ctx.user.id
					}
				},
				slug,
				uid,
				forum: {
					connect: {
						uid: input.forum,
					},
				},
			},
		});

		return { uid: thread.uid };
	});
