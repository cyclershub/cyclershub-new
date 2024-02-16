import { prisma } from "./shared";
import jwt from "jsonwebtoken"
import type { User } from "@prisma/client";

export async function getAccessTokenUser(accessToken: string): Promise<User | null> {
	try {
		const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

		const user = await prisma.user.findUnique({
			where: {
				uid: decoded.uid
			}
		});

		if (!user) {
			return null
		}

		return user;
	} catch (e) {
		return null
	}
}