import jwt from "jsonwebtoken";

export enum TokenType {
	Access,
	Refresh
}

export function decodeToken<T>(token: string): T {
	return jwt.verify(token, process.env.JWT_SECRET as string) as T;
}

export function signToken<T extends Object>(payload: T): string {
	return jwt.sign(payload, process.env.JWT_SECRET as string);
}