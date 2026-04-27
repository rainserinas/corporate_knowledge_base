import { it, expect } from "vitest";
import { sanitizeArticlePayload } from "./api-helpers";

it("should strip out non-serializable and unwanted fields", () => {
    const rawInput = {
        title: "New Post",
        slug: "new-post",
        status: "Published",
        content: "<p>Hello</p>",
        category: "uuid-12345",
        // These represent the "junk" that causes stringification errors
        internalState: { loading: false },
        tempFunction: () => console.log("test"),
        lastUpdatedBy: "Admin",
    };

    const result = sanitizeArticlePayload(rawInput);

    // Should only have our 5 target keys
    expect(Object.keys(result)).toHaveLength(5);
    expect(result).not.toHaveProperty("internalState");
    expect(result).not.toHaveProperty("tempFunction");
    expect(result.title).toBe("New Post");
});
