import type { Request as ExpressRequest, Response as ExpressResponse } from "express";
import type { VercelRequest, VercelResponse } from "@vercel/node";

declare global {
	type APIRequest = ExpressRequest | VercelRequest;
	type APIResponse = ExpressResponse | VercelResponse;
}
