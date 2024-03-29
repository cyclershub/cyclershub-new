import { z } from "zod";
import { t } from "./context";
import { prisma } from "../lib/shared";
import { TRPCError } from "@trpc/server";
import { Avatar, AvatarType, BackgroundType } from "@continuum-ai/avatars";
import moment from "moment";
import passwordHash from "password-hash"
import { v4 as uuidv4 } from "uuid";
import { privateProcedure } from "./middlewares/privateProcedure";
import { TokenType, signToken } from "../lib/tokens";
import * as fs from "fs"
import { sendSignupConfirmationEmail } from "@lib/email/sendSignupConfirmationEmail";

export const UserRouter = t.router({
	create: t.procedure.input(z.object({
		first_name: z.string(),
		last_name: z.string(),
		email: z.string(),
		password: z.string(),
		username: z.string()
	})).output(z.object({
		uid: z.string().uuid()
	})).mutation(async ({input}) => {
		// Make sure the email or the username doesn't already exist
		const existingEmail = await prisma.user.findUnique({
			where: {
				email: input.email
			}
		})

		if (existingEmail) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Email address is already in use.'
			})
		}

		const existingUsername = await prisma.user.findUnique({
			where: {
				username: input.username
			}
		})

		if (existingUsername) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Username has already been taken.'
			})
		}

		const uid = uuidv4();

		const avatar = await Avatar.assemble(input.email, AvatarType.Robots, BackgroundType.Landscape);

		const buffer = await avatar.toBuffer();

		fs.writeFileSync(`./persistent/images/${uid}.jpeg`, buffer);

		const user = await prisma.user.create({
			data: {
				uid,
				first_name: input.first_name,
				last_name: input.last_name,
				email: input.email,
				password: passwordHash.generate(input.password),
				username: input.username,
				avatar: `/api/image/${uid}`
			}
		})

		if (!user) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'User not created'
			})
		}

		const userValidationToken = signToken({ uid: user.uid, exp: moment().add(2, 'days').unix(), typ: TokenType.EmailValidation })

		// We should send a confirmation email
		const mail = await sendSignupConfirmationEmail(user.email, userValidationToken)
		// TODO: Make sure the mail was sent successfully

		return { uid };
	}),
	get: t.procedure.input(z.object({
		uid: z.string().uuid()
	})).query(({input}) => {
		const user = prisma.user.findUnique({
			where: {
				uid: input.uid
			}
		})

		if (!user) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'User not found'
			})
		}

		return user;
	}),
	getSelf: privateProcedure.query(async ({ctx}) => {
		return ctx.user;
	}),

	getFromUsername: t.procedure.input(z.object({
		username: z.string()
	})).output(z.object({
		email: z.string().nullable(),
		first_name: z.string().nullable(),
		last_name: z.string().nullable(),
		username: z.string().nullable(),
		uid: z.string().uuid().nullable(),
		address: z.string().nullable(),
		city: z.string().nullable(),
		available_to_host: z.boolean().nullable(),
		country: z.string().nullable(),
		created_at: z.date().nullable(),
		lat: z.number().nullable(),
		lng: z.number().nullable(),
		avatar: z.string().nullable(),
		zip: z.string().nullable(),
		state: z.string().nullable(),
		phone_number: z.string().nullable(),
		biography: z.string().nullable()
	})).query(({input}) => {
		const user = prisma.user.findUnique({
			where: {
				username: input.username
			},
			select: {
				email: true,
				first_name: true,
				last_name: true,
				username: true,
				uid: true,
				address: true,
				city: true,
				available_to_host: true,
				country: true,
				created_at: true,
				lat: true,
				lng: true,
				avatar: true,
				zip: true,
				state: true,
				phone_number: true,
				biography: true
			}
		})

		if (!user) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'User not found'
			})
		}

		return user;
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

		const refreshToken = signToken({ uid: user.uid, exp: expires, typ: TokenType.Refresh })

		await prisma.refreshToken.create({
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
		refreshToken: z.string(),
		accessTokenExpiryTimestampMs: z.number(),
		refreshTokenExpiryTimestampMs: z.number()
	})).query(async ({input}) => {
		const dbToken = await prisma.refreshToken.findUnique({
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

		const user = await prisma.user.findUnique({
			where: {
				id: dbToken.user_id
			}
		})

		// Invalidate the refresh token and rotate it
		await prisma.refreshToken.delete({
			where: {
				token: input.refreshToken
			}
		})

		if (!user) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'User not found'
			})
		}

		// Generate a new refresh token
		const refreshTokenExpiryTimestampMs = moment().add(7, 'days').unix();
		const refreshToken = signToken({ uid: user.uid, exp: refreshTokenExpiryTimestampMs, typ: TokenType.Refresh })

		await prisma.refreshToken.create({
			data: {
				token: refreshToken,
				user: {
					connect: {
						id: user.id
					}
				}
			}
		})

		const accessTokenExpiryTimestampMs = moment().add(1, 'hour').unix();
		const accessToken = signToken({ uid: user.uid, exp: accessTokenExpiryTimestampMs, typ: TokenType.Access })

		return { accessToken, refreshToken, accessTokenExpiryTimestampMs, refreshTokenExpiryTimestampMs }
	}),
	update: privateProcedure.input(z.object({
		email: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		username: z.string().optional(),
		address: z.string().nullable(),
		city: z.string().nullable(),
		available_to_host: z.boolean().optional(),
		country: z.string().nullable(),
		lat: z.number().nullable(),
		lng: z.number().nullable(),
		avatar: z.string().nullable(),
		banner: z.string().nullable(),
		zip: z.string().nullable(),
		state: z.string().nullable(),
		phone_number: z.string().nullable(),
		biography: z.string().nullable()
	})).output(z.object({
		uid: z.string().uuid(),
		geocoding: z.object({
			lat: z.number(),
			lng: z.number()
		})
	})).mutation(async ({input, ctx}) => {
		// Use a geocoding API to get lat and lng
		const address = encodeURIComponent(`${input.address}, ${input.zip} ${input.city} ${input.country}`);
		const geocoding = await fetch(`https://geocode.maps.co/search?q=${address}&api_key=${process.env.GEOCODE_API_KEY}`).then(res => res.json());

		let data = input

		if (geocoding.length > 0) {
			data = {...input, lat: parseFloat(geocoding[0].lat), lng: parseFloat(geocoding[0].lon)}
		}


		const user = await prisma.user.update({
			where: {
				uid: ctx.user.uid
			},
			data
		})
		
		

		if (!user) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'User not found'
			})
		}

		return { uid: user.uid, geocoding: { lat: data.lat, lng: data.lng } }
	}),
})