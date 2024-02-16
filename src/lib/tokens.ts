import jwt from "jsonwebtoken";

export function decodeToken<T>(token: string): T {
	return jwt.verify(token, process.env.JWT_SECRET as string) as T;
}