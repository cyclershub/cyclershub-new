import { z } from "zod";
import { privateProcedure } from "../middlewares/privateProcedure";
import slugify from "slugify";
import { prisma } from "../../lib/shared";
import { TRPCError } from "@trpc/server";
import { v4 } from "uuid";

export const createForumProcedure = privateProcedure
	.input(
		z.object({
			title: z.string(),
			description: z.string(),
		})
	)
	.output(z.object({ uid: z.string().uuid() }))
	.mutation(async ({ ctx, input }) => {
		// Create a slug based off the title
		const slug = slugify(input.title);

		// Check if the forum already exists
		const existingForum = await prisma.forum.findFirst({
			where: {
				slug,
			},
		});

		if (existingForum) {
			throw new TRPCError({
				code: "CONFLICT",
				message: "A forum with this title already exists.",
			});
		}

		const uid = v4();

		// Create the forum
		const forum = await prisma.forum.create({
			data: {
				title: input.title,
				description: input.description,
				slug,
				uid
			},
		});

		return { uid };
	});
