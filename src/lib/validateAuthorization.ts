import { TRPCError } from "@trpc/server";
import { prisma } from "./shared";
import { TokenType, decodeToken } from "./tokens";

export async function validateAuthorization(authorization: string | null) {
	if (!authorization) {
		throw new TRPCError({ code: "UNAUTHORIZED", message: "This procedure requires a Bearer token" });
	}

	const [authorizationType, value] = authorization.split(" ");

	if (authorizationType != "Bearer") {
		// Wir unterstützen nur Bearer Tokens
		throw new TRPCError({ code: "UNAUTHORIZED", message: "This procedure requires a Bearer token" });
	}

	const stringToken = Buffer.from(value, "base64").toString();

	if (!stringToken) {
		throw new TRPCError({ code: "UNAUTHORIZED", message: "This procedure requires a Bearer token" });
	}

	try {
		// Wenn der Token von uns erstellt wurde (und returnnicht manipuliert wurde), dann ist er valide und wir können ihn decodieren.
		// Andernfalls wird eine Exception geworfen.
		const token = decodeToken<{ uid: string, typ: TokenType }>(stringToken)
		
		const uid = token.uid;

		if (!uid || token.typ !== TokenType.Access) {
			throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" });
		}

		const user = await prisma.user.findUnique({
			where: {
				uid
			}
		});

		if (!user) {
			throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" });
		}

		return user
	} catch (e) {
		throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" });
	}
}