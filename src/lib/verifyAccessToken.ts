import jwt from "jsonwebtoken";
import moment from "moment";

export function verifyAccessToken(accessToken: string): boolean {
	try {
		const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

		if (!decoded.exp || decoded.exp < moment().unix()) {
			return false;
		}

		return true;
	} catch (e) {
		return false;
	}
}
