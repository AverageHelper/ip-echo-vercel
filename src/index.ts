// TODO: Make this into an Edge function that returns the caller's IP address
export function echo(req: APIRequest, res: APIResponse): void {
	setCommonHeaders(res);

	switch (req.method?.toUpperCase()) {
		// Normal requests:
		case "GET":
			res //
				.status(200)
				.json("Hello, World!")
				.end();
			break;

		// CORS preflight:
		case "OPTIONS":
			res.status(200).end();
			break;

		// Everything else:
		default:
			res.status(405).end();
			break;
	}
}

function setCommonHeaders(res: APIResponse): void {
	res
		.setHeader("Cache-Control", "no-store")
		.setHeader("Vary", "*") // See https://stackoverflow.com/a/54337073 for why "Vary: *" is necessary for Safari
		.setHeader("X-Clacks-Overhead", "GNU Terry Pratchett")
		.setHeader(
			"Access-Control-Allow-Headers",
			"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
		)
		.setHeader("Access-Control-Allow-Origin", "*");
}
