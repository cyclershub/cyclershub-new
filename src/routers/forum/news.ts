import { z } from "zod";
import { publicProcedure } from "../middlewares/publicProcedure";
import { prisma } from "../../lib/shared";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import type { Forum, Thread } from "@prisma/client";
import { EventEmitter } from "events";

export const threadEventEmitter = new EventEmitter()

export const threadNewsProcedure = publicProcedure
	.input(
		z.object({
			forum: z.string().uuid().optional()
		})
	)
	.subscription(async ({ ctx, input }) => {
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
		}

		return observable<Thread>((emit) => {
			threadEventEmitter.on("add", (data: Thread) => {
				if (!input.forum || data.forum_id === forum.id) {
					emit.next(data)
				}
			})
		})
	});
