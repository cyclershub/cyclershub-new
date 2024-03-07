import { z } from "zod";
import { t } from "./context";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { validateJsonWebToken } from "../lib/validateJsonWebToken";
import { prisma } from "../lib/shared";
import { v4 as uuidv4 } from 'uuid';
import { TRPCError } from "@trpc/server";

const messageEventEmitter = new EventEmitter();

const MessageObject = z.object({
	created_at: z.date(),
	message: z.string(),
	receiver: z.object({
		username: z.string(),
		avatar: z.string().nullable()
	}),
	sender: z.object({
		username: z.string(),
		avatar: z.string().nullable()
	}),
	uid: z.string().uuid()
})

export const MessageRouter = t.router({
	onReceive: t.procedure.input(z.object({
		accessToken: z.string(),
	})).subscription(async ({input}) => {
		const user = await validateJsonWebToken(input.accessToken)

		return observable<z.infer<typeof MessageObject>>((emit) => {
			const onAdd = (data: z.infer<typeof MessageObject>) => {
				// emit data to client
				if (data.receiver.username === user.username || data.sender.username === user.username) {
					emit.next(data);
				}
			};
			// trigger `onAdd()` when `add` is triggered in our event emitter
			messageEventEmitter.on('add', onAdd);
			// unsubscribe function when client disconnects or stops subscribing
			return () => {
				messageEventEmitter.off('add', onAdd);
			};
		})
	}),
	send: t.procedure.input(z.object({
		accessToken: z.string(),
		message: z.string(),
		recipientUsername: z.string(),
	})).output(z.object({
		uid: z.string().uuid()
	})).mutation(async ({input}) => {
		const user = await validateJsonWebToken(input.accessToken)

		const uid = uuidv4();

		const recipient = await prisma.user.findUnique({
			where: {
				username: input.recipientUsername
			}
		})

		if (!recipient) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Recipient not found'
			})
		}

		const message = await prisma.message.create({
			data: {
				message: input.message,
				uid,
				receiver: {
					connect: {
						id: recipient.id
					}
				},
				sender: {
					connect: {
						id: user.id
					}
				}
			},
			select: {
				created_at: true,
				message: true,
				receiver: {
					select: {
						username: true,
						avatar: true
					}
				},
				sender: {
					select: {
						username: true,
						avatar: true
					}
				},
				uid: true
			}
		})

		messageEventEmitter.emit('add', message)

		return { uid }
	}),
	getAll: t.procedure.input(z.object({
		accessToken: z.string(),
	})).query(async ({input}) => {
		const user = await validateJsonWebToken(input.accessToken)

		const messages = await prisma.message.findMany({
			where: {
				sender: {
					id: user.id
				}
			}
		})

		return messages
	}),
	getConversationMessages: t.procedure.input(z.object({
		accessToken: z.string(),
		recipientUsername: z.string()
	})).output(z.array(MessageObject)).query(async ({input}) => {
		const user = await validateJsonWebToken(input.accessToken)

		const recipient = await prisma.user.findUnique({
			where: {
				username: input.recipientUsername
			}
		})

		if (!recipient) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Recipient not found'
			})
		}

		const messages = await prisma.message.findMany({
			where: {
				OR: [
					{
						sender_id: user.id,
						receiver_id: recipient.id
					},
					{
						sender_id: recipient.id,
						receiver_id: user.id
					}
				]
			},
			orderBy: {
				created_at: 'asc'
			},
			select: {
				created_at: true,
				message: true,
				receiver: {
					select: {
						username: true,
						avatar: true
					}
				},
				sender: {
					select: {
						username: true,
						avatar: true
					}
				},
				uid: true
			},
		})

		return messages;
	}),
	getConversations: t.procedure.input(z.object({
		accessToken: z.string()
	})).query(async ({input}) => {
		const user = await validateJsonWebToken(input.accessToken)

		const messages = await prisma.message.findMany({
			where: {
				OR: [
					{
						sender_id: user.id
					},
					{
						receiver_id: user.id
					}
				]
			},
			orderBy: {
				created_at: 'asc'
			},
			distinct: "receiver_id",
			include: {
				receiver: true,
				sender: true
			}
		});

		return messages;
	})
})