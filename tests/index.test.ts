import "jest-extended";
import { echo } from "../api/index";
import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();

describe("IP Echo", () => {
	const url = new URL("https://localhost/");
	const IP_HEADER_NAME = "x-real-ip";
	const TEST_IP = "::ffff:127.0.0.1";

	test("has a default export that matches the named export", async () => {
		// Vercel requires a default export
		const unit = await import("../api/index");
		expect(unit).toHaveProperty("default", echo);
	});

	test("has a Vercel Edge config", async () => {
		const unit = await import("../api/index");
		expect(unit).toHaveProperty("config");
		expect(unit.config).toStrictEqual({
			runtime: "edge",
		});
	});

	test("responds correctly to CORS preflight", () => {
		const req = new window.Request(url, { method: "OPTIONS" });
		const response = echo(req);
		expect(response).toHaveProperty("headers");
		expect(response.headers.get("Vary")).toBe("*");
		expect(response.headers.get("Cache-Control")).toBe("no-store");
		expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
		expect(response.status).toBe(200);
		expect(response.body).toBe(null);
	});

	// See https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
	const BadMethods = ["HEAD", "POST", "PUT", "DELETE", "TRACE", "PATCH"] as const;
	test.each(BadMethods)("responds 405 to %s requests", method => {
		const req = new window.Request(url, { method });
		const response = echo(req);
		expect(response).toHaveProperty("headers");
		expect(response.headers.get("Vary")).toBe("*");
		expect(response.headers.get("Cache-Control")).toBe("no-store");
		expect(response.status).toBe(405);
		expect(response.body).toBe(null);
	});

	test("responds with the caller's IP address", async () => {
		const req = new window.Request(url, { method: "GET", headers: { [IP_HEADER_NAME]: TEST_IP } });
		const response = echo(req);
		expect(response).toHaveProperty("headers");
		expect(response.headers.get("Vary")).toBe("*");
		expect(response.headers.get("Cache-Control")).toBe("no-store");
		expect(response.headers.get("Content-Type")).toBe("application/json");
		expect(response.status).toBe(200);
		expect(await response.json()).toBe(TEST_IP);
	});

	test("responds with 'unknown' if there is no 'X-Real-IP' header", () => {
		const req = new window.Request(url, { method: "GET" });
		const response = echo(req);
		expect(response.status).toBe(404);
		expect(response.body).toBe(null);
	});
});
