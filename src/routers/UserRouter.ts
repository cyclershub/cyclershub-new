import { z } from "zod";
import { t } from "./context";
import { prisma } from "../lib/shared";
import jwt from 'jsonwebtoken'
import { TRPCError } from "@trpc/server";
//import { Avatar, AvatarType, BackgroundType } from "@continuum-ai/avatars";
import moment from "moment";
import passwordHash from "password-hash"
import { v4 as uuidv4 } from "uuid";
import { validateJsonWebToken } from "../lib/validateJsonWebToken";
import { privateProcedure } from "./middlewares/privateProcedure";
import { decodeToken } from "../lib/tokens";

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
		//const avatar = await Avatar.assemble(input.email, AvatarType.Robots, BackgroundType.Landscape);

		//const buffer = await avatar.toBuffer();

		//fs.writeFileSync(`public/avatars/${input.email}.png`, buffer);

		const uid = uuidv4();

		const user = await prisma.user.create({
			data: {
				uid,
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

		const refreshToken = jwt.sign({ uid: user.uid, exp: expires }, process.env.JWT_SECRET)

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

		const decoded = decodeToken<{ uid: string }>(input.refreshToken)

		const user = await prisma.user.findUnique({
			where: {
				uid: decoded.uid
			}
		})

		if (!user) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'User not found'
			})
		}

		const expires = moment().add(1, 'hour').unix();

		const accessToken = jwt.sign({ uid: user.uid, exp: expires }, process.env.JWT_SECRET)

		return { accessToken, expires }
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