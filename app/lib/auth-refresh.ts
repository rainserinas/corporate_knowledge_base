// lib/auth-refresh.ts or similar
"use server";
import { cookies } from "next/headers";

export async function getValidToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("directus_token")?.value;
    return token ?? null;
}
