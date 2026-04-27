"use server";

import { getValidToken } from "../lib/auth-refresh";
import { revalidatePath } from "next/cache";

export async function archiveArticle(id: string | number) {
    const token = await getValidToken();
    if (!token) throw new Error("Unauthorized");

    const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/articles/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            status: "Archived",
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to archive the article");
    }

    revalidatePath("/manage");
    return { success: true };
}

export async function createArticle(data: any) {
    const token = await getValidToken();
    if (!token) throw new Error("Unauthorized");

    const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/articles`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to create article");

    revalidatePath("/manage");
    return { success: true };
}

export async function updateArticle(id: string | number, data: any) {
    const token = await getValidToken();
    if (!token) throw new Error("Unauthorized");

    const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/articles/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to update article");

    revalidatePath("/manage");
    return { success: true };
}
