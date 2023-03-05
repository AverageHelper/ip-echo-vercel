import { ipAddress } from "@vercel/edge";

export function echo(req: Request): Response {
	switch (req.method?.toUpperCase()) {
		// Normal requests:
		case "GET": {
			const ip = ipAddress(req);
			if (!ip) {
				return new Response(undefined, {
					status: 404,
					headers: { ...headers, "Content-Type": "application/json" },
				});
			}

			const accept = req.headers.get("accept");
			if (accept?.includes("application/json")) {
				return new Response(JSON.stringify(ip).concat("\n"), {
					status: 200,
					headers: { ...headers, "Content-Type": "application/json" },
				});
			}
			return new Response(ip.concat("\n"), {
				status: 200,
				headers: { ...headers, "Content-Type": "text/html" },
			});
		}

		// CORS preflight:
		case "OPTIONS":
			return new Response(undefined, { status: 200, headers });

		// Everything else:
		default:
			return new Response(undefined, { status: 405, headers });
	}
}

const headers = {
	"Cache-Control": "no-store",
	Vary: "*", // See https://stackoverflow.com/a/54337073 for why "Vary: *" is necessary for Safari
	"X-Clacks-Overhead": "GNU Terry Pratchett",
	"Access-Control-Allow-Headers":
		"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
	"Access-Control-Allow-Origin": "*",
};

// Vercel Edge config:
export default echo;

export const config = {
	runtime: "edge",
};
