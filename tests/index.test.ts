import "jest-extended";
import endpoint from "../api/index";
import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks(); // Enables use of `Request` and `Response` objects

function assertHasSecurityHeaders(res: Response): void {
	expect(res).toHaveProperty("headers");

	// ** Security **
	// Vercel seems to set Strict-Transport-Security automatically
	expect(res.headers.get("Content-Security-Policy")).toBe("default-src 'self'");
	expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
	expect(res.headers.get("X-Frame-Options")).toBe("SAMEORIGIN");
	expect(res.headers.get("Referrer-Policy")).toBe("no-referrer");
	expect(res.headers.get("Permissions-Policy")).toBe(
		"accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), clipboard-read=(), clipboard-write=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=*, gamepad=(), geolocation=(), gyroscope=(), identity-credentials-get=(), idle-detection=(), interest-cohort=(), keyboard-map=(), local-fonts=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=*, publickey-credentials-create=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), speaker-selection=(), storage-access=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()"
	);

	// ** Miscellaneous **
	expect(res.headers.get("Vary")).toBe("*");
	expect(res.headers.get("Cache-Control")).toBe("no-store");
	expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
	expect(res.headers.get("Access-Control-Allow-Methods")).toInclude("GET");
	expect(res.headers.get("Access-Control-Allow-Headers")).toInclude("Accept");
}

describe("IP Echo", () => {
	const url = new URL("https://localhost/");
	const IP_HEADER_NAME = "x-real-ip";
	const TEST_IP = "::ffff:127.0.0.1";

	test("has a Vercel Edge config", async () => {
		const unit = await import("../api/index");
		expect(unit).toHaveProperty("config");
		expect(unit.config).toStrictEqual({
			runtime: "edge",
		});
	});

	test("responds correctly to CORS preflight", () => {
		const req = new window.Request(url, { method: "OPTIONS" });
		const res = endpoint(req);
		expect(res.status).toBe(204);
		assertHasSecurityHeaders(res);
		expect(res.body).toBe(null);
	});

	// See https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
	const BadMethods = ["HEAD", "POST", "PUT", "DELETE", "TRACE", "PATCH"] as const;
	test.each(BadMethods)("responds 405 to %s requests", method => {
		const req = new window.Request(url, { method });
		const res = endpoint(req);
		expect(res.status).toBe(405);
		assertHasSecurityHeaders(res);
		expect(res.body).toBe(null);
	});

	test("responds with the caller's IP address", async () => {
		const req = new window.Request(url, { headers: { [IP_HEADER_NAME]: TEST_IP } });
		const res = endpoint(req);
		expect(res.headers.get("Content-Type")).toBe("text/plain");
		expect(res.status).toBe(200);
		assertHasSecurityHeaders(res);
		expect(await res.text()).toBe(TEST_IP.concat("\n"));
	});

	test("responds with the caller's IP address in JSON", async () => {
		const req = new window.Request(url, {
			headers: {
				[IP_HEADER_NAME]: TEST_IP,
				Accept: "application/json",
			},
		});
		const res = endpoint(req);
		expect(res.status).toBe(200);
		assertHasSecurityHeaders(res);
		expect(res.headers.get("Content-Type")).toBe("application/json");
		expect(await res.json()).toBe(TEST_IP);
	});

	test("responds with 404 if there is no 'X-Real-IP' header", () => {
		const req = new window.Request(url);
		const res = endpoint(req);
		expect(res.status).toBe(404);
		assertHasSecurityHeaders(res);
		expect(res.body).toBe(null);
	});
});
