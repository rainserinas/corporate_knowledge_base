// lib/auth-refresh.ts or similar
"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getValidToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("directus_token")?.value;

    if (!token) {
        redirect("/login");
    }

    return token ?? null;
}
