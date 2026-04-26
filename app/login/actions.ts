"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface LoginCredentials {
    email: string;
    password: string;
}

export async function loginAction({ email, password }: LoginCredentials) {
    const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

    if (!email || !password) {
        return { success: false, error: "Email and password are required." };
    }

    try {
        const response = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: result.errors?.[0]?.message || "Invalid credentials",
            };
        }

        const token = result.data.access_token;
        const cookieStore = await cookies();

        cookieStore.set("directus_token", token, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600,
            sameSite: "lax",
        });

        return { success: true };
    } catch (err) {
        return { success: false, error: "System error. Please try again later." };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();

    cookieStore.delete("directus_token");

    redirect("/login");
}
