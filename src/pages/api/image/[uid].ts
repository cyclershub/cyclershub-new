import type { APIRoute } from "astro";
import * as fs from "fs"

export const GET: APIRoute = async ({params}) => {
	const { uid } = params;

		const path = `./persistent/images/${uid}.jpeg`;

		if (!fs.existsSync(path)) {
			return new Response('Image not found', { status: 404 });
		}

		const buffer = Buffer.from(fs.readFileSync(path, 'base64'), 'base64');

		return new Response(buffer, { status: 200, headers: { 'Content-Type': 'image/jpeg' }});
}