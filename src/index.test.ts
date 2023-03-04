import type { VercelRequest, VercelResponse } from "@vercel/node";
import "jest-extended";
import { echo } from "./index";
import express from "express";
import request from "supertest";

describe("IP Echo", () => {
	const TEST_IP = "::ffff:127.0.0.1";
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

	test("responds with the caller's IP address", async () => {
		const response = await request(app)
			.get("/")
			.expect("Vary", "*")
			.expect("Cache-Control", "no-store")
			.expect("Content-Type", /json/u)
			.expect(200);
		expect(response.body).toBe(TEST_IP);
	});

	describe("when in Vercel", () => {
		const IP_HEADER_NAME = "x-real-ip";
		let mockReq: VercelRequest;
		let mockRes: VercelResponse;

		beforeEach(() => {
			mockReq = {
				method: "GET",
				headers: {},
			} as unknown as VercelRequest;
			mockRes = {
				setHeader: jest.fn().mockImplementation(() => mockRes),
				status: jest.fn().mockImplementation(() => mockRes),
				json: jest.fn().mockImplementation(() => mockRes),
				end: jest.fn().mockImplementation(() => mockRes),
			} as unknown as VercelResponse;
		});

		test("responds with 'unknown' if there is no 'X-Real-IP' header", () => {
			expect(echo(mockReq, mockRes)).toBeUndefined(); // returns void
			expect(mockRes.status).toHaveBeenCalledOnceWith(404);
			expect(mockRes.json).not.toHaveBeenCalled();
		});

		test("responds with the IP address defined in the 'X-Real-IP' header", () => {
			mockReq.headers[IP_HEADER_NAME] = TEST_IP;
			expect(echo(mockReq, mockRes)).toBeUndefined(); // returns void
			expect(mockRes.status).toHaveBeenCalledOnceWith(200);
			expect(mockRes.json).toHaveBeenCalledOnceWith(TEST_IP);
		});
	});
});
