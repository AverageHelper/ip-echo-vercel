import "jest-extended";
import endpoint from "../api/index";
import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks(); // Enables use of `Request` and `Response` objects

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
		const response = endpoint(req);
		expect(response).toHaveProperty("headers");
		expect(response.headers.get("Vary")).toBe("*");
		expect(response.headers.get("Cache-Control")).toBe("no-store");
		expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
		expect(response.headers.get("Access-Control-Allow-Methods")).toInclude("GET");
		expect(response.headers.get("Access-Control-Allow-Headers")).toInclude("Accept");
		expect(response.status).toBe(204);
		expect(response.body).toBe(null);
	});

	// See https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
	const BadMethods = ["HEAD", "POST", "PUT", "DELETE", "TRACE", "PATCH"] as const;
	test.each(BadMethods)("responds 405 to %s requests", method => {
		const req = new window.Request(url, { method });
		const response = endpoint(req);
		expect(response).toHaveProperty("headers");
		expect(response.headers.get("Vary")).toBe("*");
		expect(response.headers.get("Cache-Control")).toBe("no-store");
		expect(response.status).toBe(405);
		expect(response.body).toBe(null);
	});

	test("responds with the caller's IP address", async () => {
		const req = new window.Request(url, { headers: { [IP_HEADER_NAME]: TEST_IP } });
		const response = endpoint(req);
		expect(response).toHaveProperty("headers");
		expect(response.headers.get("Vary")).toBe("*");
		expect(response.headers.get("Cache-Control")).toBe("no-store");
		expect(response.headers.get("Content-Type")).toBe("text/html");
		expect(response.status).toBe(200);
		expect(await response.text()).toBe(TEST_IP.concat("\n"));
	});

	test("responds with the caller's IP address in JSON", async () => {
		const req = new window.Request(url, {
			headers: {
				[IP_HEADER_NAME]: TEST_IP,
				Accept: "application/json",
			},
		});
		const response = endpoint(req);
		expect(response).toHaveProperty("headers");
		expect(response.headers.get("Vary")).toBe("*");
		expect(response.headers.get("Cache-Control")).toBe("no-store");
		expect(response.headers.get("Content-Type")).toBe("application/json");
		expect(response.status).toBe(200);
		expect(await response.json()).toBe(TEST_IP);
	});

	test("responds with 404 if there is no 'X-Real-IP' header", () => {
		const req = new window.Request(url);
		const response = endpoint(req);
		expect(response.status).toBe(404);
		expect(response.body).toBe(null);
	});
});
