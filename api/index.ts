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
	let contentType = "text/plain";

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
	"Content-Security-Policy": "default-src 'self'",
	"X-Content-Type-Options": "nosniff",
	"X-Frame-Options": "SAMEORIGIN",
	"Referrer-Policy": "no-referrer",
	"Permissions-Policy":
		"accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), clipboard-read=(), clipboard-write=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=*, gamepad=(), geolocation=(), gyroscope=(), identity-credentials-get=(), idle-detection=(), interest-cohort=(), keyboard-map=(), local-fonts=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=*, publickey-credentials-create=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), speaker-selection=(), storage-access=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()",
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
