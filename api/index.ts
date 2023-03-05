import { ipAddress } from "@vercel/edge";

function echo(req: Request): Response {
	const ip = ipAddress(req);
	if (!ip) {
		// No IP address found in headers (or wherever Vercel Edge likes to put those)
		return new Response(undefined, { status: 404, headers });
	}

	// Found IP, respond the way the caller wants us to:
	const accept = req.headers.get("accept");
	let message = ip;
	let contentType = "text/html";

	if (accept?.includes("application/json")) {
		message = JSON.stringify(ip);
		contentType = "application/json";
	}

	return new Response(message.concat("\n"), {
		status: 200,
		headers: { ...headers, "Content-Type": contentType },
	});
}

// Common headers:
const headers = {
	Vary: "*", // See https://stackoverflow.com/a/54337073 for why "Vary: *" is necessary for Safari
	"Cache-Control": "no-store",
	"X-Clacks-Overhead": "GNU Terry Pratchett",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers": "Accept, Content-Length, Content-Type, Date",
	"Access-Control-Allow-Origin": "*",
};

// Vercel wants the endpoint to be a `default` export:
export default function handler(req: Request): Response {
	switch (req.method.toUpperCase()) {
		// Normal requests:
		case "GET":
			return echo(req);

		// CORS preflight:
		case "OPTIONS":
			return new Response(undefined, { status: 204, headers });

		// Everything else:
		default:
			return new Response(undefined, { status: 405, headers });
	}
}

// Vercel Edge config:
export const config = {
	runtime: "edge",
};
