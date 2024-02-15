import { TRPCError } from "@trpc/server";
import { prisma } from "./shared";
import jwt from "jsonwebtoken"
import type { User } from "@prisma/client";

export async function validateJsonWebToken(accessToken: string): Promise<User | never> {
	const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

	const user = await prisma.user.findUnique({
		where: {
			id: decoded.id
		}
	});

	if (!user) {
		throw new TRPCError({
			code: 'BAD_REQUEST',
			message: 'User not found'
		});
	}

	return user;
}