"use server";

import { getValidToken } from "../lib/auth-refresh";
import { revalidatePath } from "next/cache";
import { authenticatedFetch } from "../lib/directus-client";

export async function archiveArticle(id: string | number) {
    const token = await getValidToken();
    if (!token) throw new Error("Unauthorized");

    const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/articles/${id}`,
        {
            method: "PATCH",
            body: JSON.stringify({
                status: "Archived",
            }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to archive the article");
    }

    revalidatePath("/manage");
    return { success: true };
}

export async function createArticle(data: any) {
    const token = await getValidToken();
    if (!token) throw new Error("Unauthorized");

    const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/articles`,
        {
            method: "POST",
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) throw new Error("Failed to create article");

    revalidatePath("/manage");
    return { success: true };
}

export async function updateArticle(id: string | number, data: any) {
    const token = await getValidToken();
    if (!token) throw new Error("Unauthorized");

    try {
        // 1. Fetch categories to find the ID that matches the Name
        const catRes = await authenticatedFetch(
            `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/categories`,
            {}
        );
        const { data: categories } = await catRes.json();

        // 2. Map the name to the ID
        // We look for a category where the name matches data.category
        const matchedCat = categories.find((c: any) => c.name === data.category);

        if (!matchedCat) {
            throw new Error(`Category "${data.category}" not found.`);
        }

        // 3. Swap the name for the ID in the payload
        const payload = {
            ...data,
            category: matchedCat.id, // Replace "Tooling" with the ID (e.g. 5)
        };

        const response = await authenticatedFetch(
            `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/articles/${id}`,
            {
                method: "PATCH",
                body: JSON.stringify(payload), // Send the updated payload
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Directus Error Response:", JSON.stringify(errorData, null, 2));
            const errorMessage = errorData.errors?.[0]?.message || "An unknown error occurred";
            throw new Error(errorMessage);
        }

        revalidatePath("/manage");
        return { success: true };
    } catch (error: any) {
        console.error("Update Action Failed:", error.message);
        throw error;
    }
}
