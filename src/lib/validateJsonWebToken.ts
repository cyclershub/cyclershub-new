import { TRPCError } from "@trpc/server";
import { prisma } from "./shared";
import jwt from "jsonwebtoken"
import type { User } from "@prisma/client";

export async function validateJsonWebToken(accessToken: string): Promise<User | never> {
	try {
		const decoded = jwt.verify(accessToken, process.env.JWT_SECRET) as { uid: string };

		const user = await prisma.user.findUnique({
			where: {
				uid: decoded.uid
			}
		});

		if (!user) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'User not found'
			});
		}

		return user;
	} catch (e) {
		throw new TRPCError({
			code: 'INTERNAL_SERVER_ERROR',
			message: 'Invalid access token'
		});
	}
}