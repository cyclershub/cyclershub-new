import nodemailer from "nodemailer";

export async function sendSignupConfirmationEmail(email: string, token: string) {
	const transport = nodemailer.createTransport({
		service: "gmx",
		auth: {
			user: "moritz.utcke@gmx.de",
			pass: "Geiloboy1"
		}
	});

	const mail = await transport.sendMail({
		from: "info@cyclershub.com",
		to: email,
		subject: "Welcome to The CyclersHub!",
		text: `Welcome to The CyclersHub!\nWe're excited to have you as a member of our community. Please click the link below to confirm your email address.\n\nhttps://cyclershub.com/auth/confirm-email?token=${token}\n\nThanks,\nThe CyclersHub Team`,
	})

	return mail;
}