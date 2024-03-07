import jwt from "jsonwebtoken";
import moment from "moment";
import { TokenType, decodeToken } from "./tokens";

export function verifyAccessToken(accessToken: string): boolean {
	try {
		const decoded = decodeToken<{ uid: string, exp: number, typ: TokenType }>(accessToken);

		if (!decoded.exp || decoded.exp < moment().unix() || decoded.typ !== TokenType.Access) {
			return false;
		}

		return true;
	} catch (e) {
		return false;
	}
}
