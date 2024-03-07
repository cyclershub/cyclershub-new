import { verifyAccessToken } from '../lib/verifyAccessToken';
import { createCaller } from "../lib/caller";
import { createContextInner } from '../routers/context';
import moment from 'moment';
import type { AstroGlobal } from 'astro';

export async function refreshAccessToken(astro: AstroGlobal) {
	// If the access token is invalid and a refresh token is present, renew the access token
const accessToken = astro.cookies.get("accessToken")?.value;
const refreshToken = astro.cookies.get("refreshToken")?.value;

if ((accessToken && !verifyAccessToken(accessToken) && refreshToken) || (!accessToken && refreshToken)) {
	const ctx = createContextInner(astro);
	const caller = createCaller(ctx);

	try {
		const response = await caller.user.getAccessToken({
			refreshToken
		});

		astro.cookies.set("accessToken", response.accessToken, {
			expires: moment.unix(response.accessTokenExpiryTimestampMs).toDate()
		});

		astro.cookies.set("refreshToken", response.refreshToken, {
			expires: moment.unix(response.refreshTokenExpiryTimestampMs).toDate()
		});
	} catch (e) {
		astro.cookies.delete("accessToken");
		astro.cookies.delete("refreshToken");
	}
} else if (!refreshToken) {
	astro.cookies.delete("accessToken");
	astro.cookies.delete("refreshToken");
}
}