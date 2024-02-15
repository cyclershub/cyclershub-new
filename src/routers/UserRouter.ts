import { z } from "zod";
import { t } from "./t";
import { prisma } from "../lib/shared";
import jwt from 'jsonwebtoken'
import { TRPCError } from "@trpc/server";
import { Avatar, AvatarType, BackgroundType } from "@continuum-ai/avatars";
import moment from "moment";
import passwordHash from "password-hash"
import * as fs from "fs"

export const UserRouter = t.router({
	create: t.procedure.input(z.object({
		first_name: z.string(),
		last_name: z.string(),
		email: z.string(),
		password: z.string(),
		username: z.string()
	})).mutation(async ({input}) => {
		const avatar = await Avatar.assemble(input.email, AvatarType.Robots, BackgroundType.Landscape);

		const buffer = await avatar.toBuffer();

		fs.writeFileSync(`public/avatars/${input.email}.png`, buffer);

		const user = await prisma.user.create({
			data: {
				first_name: input.first_name,
				last_name: input.last_name,
				email: input.email,
				password: passwordHash.generate(input.password),
				username: input.username
			}
		})

		if (!user) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'User not created'
			})
		}

		return user.id;
	}),
	get: t.procedure.query(() => {
		return { id: '1', name: 'Test' }
	}),
	getRefreshToken: t.procedure.input(z.object({
		email: z.string(),
		password: z.string(),
	})).output(z.object({
		refreshToken: z.string(),
		expires: z.number()
	})).query(async ({input}) => {
		// Attempt to log the user in
		const user = await prisma.user.findUnique({
			where: {
				email: input.email,
			}
		})

		if (!user) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'User not found'
			})
		}

		if (!passwordHash.verify(input.password, user.password)) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Invalid password'
			})
		}

		const expires = moment().add(7, 'days').unix();

		const refreshToken = jwt.sign({ id: user.id, exp: expires }, process.env.JWT_SECRET)

		const dbToken = await prisma.refreshToken.create({
			data: {
				token: refreshToken,
				user: {
					connect: {
						id: user.id
					}
				}
			}
		})

		return { refreshToken, expires }
	}),
	getAccessToken: t.procedure.input(z.object({
		refreshToken: z.string(),
	})).output(z.object({
		accessToken: z.string(),
		expires: z.number()
	})).query(async ({input}) => {
		const dbToken = prisma.refreshToken.findUnique({
			where: {
				token: input.refreshToken
			}
		})

		if (!dbToken) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Invalid refresh token'
			})
		}

		const decoded = jwt.verify(input.refreshToken, process.env.JWT_SECRET)

		const user = await prisma.user.findUnique({
			where: {
				id: decoded.id
			}
		})

		if (!user) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'User not found'
			})
		}

		const expires = moment().add(1, 'hour').unix();

		const accessToken = jwt.sign({ id: user.id, exp: expires }, process.env.JWT_SECRET)

		return { accessToken, expires }
	}),
})