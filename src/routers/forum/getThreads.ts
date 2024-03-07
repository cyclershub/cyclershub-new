import { z } from "zod";
import { publicProcedure } from "../middlewares/publicProcedure";
import { prisma } from "../../lib/shared";
import { TRPCError } from "@trpc/server";
import type { Forum } from "@prisma/client";

export const getThreadsProcedure = publicProcedure
	.input(
		z.object({
			forum: z.string().uuid().optional(),
			limit: z.number().min(1).max(15).default(5)
		})
	)
	.query(async ({ ctx, input }) => {
		let forum: Forum;
		if (input.forum) {
			forum = await prisma.forum.findUnique({
				where: {
					uid: input.forum
				}
			})
	
			if (!forum) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "A Forum with the given UID does not exist."
				})
			}

			return await prisma.thread.findMany({
				include: {
					forum: true
				},
				where: {
					forum: {
						id: forum.id
					}
				},
				take: input.limit,
				orderBy: {
					created_at: "desc"
				}
			})
		}

		return await prisma.thread.findMany({
			include: {
				forum: true
			},
			take: input.limit,
			orderBy: {
				created_at: "desc"
			}
		})
	});
