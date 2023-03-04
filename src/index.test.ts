import "jest-extended";
import { echo } from "./index";

describe("IP Echo", () => {
	test("does nothing right now", () => {
		expect(echo()).toBe("Hello, World!");
	});
});
