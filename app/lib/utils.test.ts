import { describe, it, expect } from "vitest";
import { generateSlug } from "./utils";

describe("generateSlug Utility", () => {
    it("converts title to lowercase and replaces spaces with dashes", () => {
        expect(generateSlug("Hello World")).toBe("hello-world");
    });

    it("removes special characters that would break URLs", () => {
        expect(generateSlug("Next.js: The Best Framework!")).toBe("next-js-the-best-framework");
    });

    it("handles multiple spaces and trailing dashes correctly", () => {
        expect(generateSlug("  Payroll -- System  ")).toBe("payroll-system");
    });
});
