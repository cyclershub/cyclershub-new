import { z } from "zod";
import { validateJsonWebToken } from "../lib/validateJsonWebToken";
import { v4 as uuidv4 } from 'uuid';
import { TRPCError } from "@trpc/server";
import * as fs from 'fs';
import { t } from "./context";
import { privateProcedure } from "./middlewares/privateProcedure";


export const ImageRouter = t.router({
	upload: privateProcedure.input(z.object({
		dataUrl: z.string()
	})).mutation(async ({input, ctx }) => {
		const { dataUrl } = input;

		const uid = uuidv4()

		// Save the image to the filesystem
		fs.writeFileSync(`./persistent/images/${uid}.jpeg`, dataUrl.replace(/^data:image\/jpeg;base64,/, ''), "base64");

		return { uid };
	}),
	get: t.procedure.input(z.object({
		uid: z.string()
	})).query(async ({input}) => {
		const { uid } = input;

		const path = `./persistent/images/${uid}.jpeg`;

		if (!fs.existsSync(path)) {
			throw new TRPCError({ code: 'NOT_FOUND', message: 'Image not found' });
		}

		return fs.readFileSync(path, 'base64');
	})
})