import { describe, it, expect } from "vitest";
import { shouldShowManagementNav } from "./utils";

describe("Navigation Visibility", () => {
    it('should show "My Knowledge Base" to Team Leads', () => {
        expect(shouldShowManagementNav("Team Leads")).toBe(true);
    });

    it('should hide "My Knowledge Base" from Members', () => {
        expect(shouldShowManagementNav("Member")).toBe(false);
    });

    it("should hide navigation for guest or unknown roles", () => {
        expect(shouldShowManagementNav(null)).toBe(false);
        expect(shouldShowManagementNav("Guest")).toBe(false);
    });
});
