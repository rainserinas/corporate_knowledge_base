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

    try {
        const payload = {
            ...data,
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/articles`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.errors?.[0]?.message || "Failed to create article";
            throw new Error(errorMessage);
        }

        revalidatePath("/manage");
        return { success: true };
    } catch (error: any) {
        console.error("Create Action Failed:", error.message);
        throw error;
    }
}

export async function updateArticle(id: string | number, data: any) {
    const token = await getValidToken();
    if (!token) throw new Error("Unauthorized");

    try {
        const payload = {
            ...data,
        };

        const response = await authenticatedFetch(
            `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/articles/${id}`,
            {
                method: "PATCH",
                body: JSON.stringify(payload),
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
