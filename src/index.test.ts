import "jest-extended";
import { echo } from "./index";
import express from "express";
import request from "supertest";

describe("IP Echo", () => {
	const app = express() //
		.use("/", echo);

	test("has a default export that matches the named export", async () => {
		// Vercel requires a default export
		const unit = await import("./index");
		expect(unit).toHaveProperty("default", echo);
	});

	test("has a Vercel Edge config", async () => {
		const unit = await import("./index");
		expect(unit).toHaveProperty("config");
		expect(unit.config).toStrictEqual({
			runtime: "edge",
		});
	});

	test("responds with 'Hello, World!'", async () => {
		const response = await request(app)
			.get("/")
			.expect("Vary", "*")
			.expect("Cache-Control", "no-store")
			.expect("Content-Type", /json/u)
			.expect(200);
		expect(response.body).toBe("Hello, World!");
	});

	test("responds correctly to CORS preflight", async () => {
		const response = await request(app)
			.options("/")
			.expect("Vary", "*")
			.expect("Cache-Control", "no-store")
			.expect("Access-Control-Allow-Origin", "*")
			.expect(200);
		expect(response.body).toStrictEqual({});
	});

	// See https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
	const BadMethods = ["HEAD", "POST", "PUT", "DELETE", "TRACE", "PATCH"] as const;
	test.each(BadMethods)("responds 405 to %s requests", async rawMethod => {
		const method = rawMethod.toLowerCase() as Lowercase<typeof rawMethod>;

		const response = await request(app)
			[method]("/")
			.expect("Vary", "*")
			.expect("Cache-Control", "no-store")
			.expect(405);
		expect(response.body).toStrictEqual({});
	});
});
