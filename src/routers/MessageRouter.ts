import { z } from "zod";
import { t } from "./t";
import type { Message } from "@prisma/client";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { validateJsonWebToken } from "../lib/validateJsonWebToken";
import { prisma } from "../lib/shared";

const messageEventEmitter = new EventEmitter();

export const MessageRouter = t.router({
	onReceive: t.procedure.input(z.object({
		accessToken: z.string(),
	})).subscription(async ({input}) => {
		const user = await validateJsonWebToken(input.accessToken)

		return observable<Message>((emit) => {
			const onAdd = (data: Message) => {
				// emit data to client
				if (data.receiver_id === user.id || data.sender_id === user.id) {
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
		recipient: z.number(),
	})).mutation(async ({input}) => {
		const user = await validateJsonWebToken(input.accessToken)

		const message = await prisma.message.create({
			data: {
				message: input.message,
				receiver: {
					connect: {
						id: input.recipient
					}
				},
				sender: {
					connect: {
						id: user.id
					}
				}
			}
		})

		messageEventEmitter.emit('add', message)
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
		otherUser: z.string()
	})).query(async ({input}) => {
		const user = await validateJsonWebToken(input.accessToken)

		const messages = await prisma.message.findMany({
			where: {
				OR: [
					{
						sender_id: user.id,
						receiver_id: parseInt(input.otherUser)
					},
					{
						sender_id: parseInt(input.otherUser),
						receiver_id: user.id
					}
				]
			},
			orderBy: {
				created_at: 'asc'
			}
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
			distinct: ['receiver_id', 'sender_id'],
			include: {
				receiver: true,
				sender: true
			}
		});

		return messages;
	})
})