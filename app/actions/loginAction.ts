"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { checkRateLimit } from "../lib/rate-limiter";

interface LoginCredentials {
    email: string;
    password: string;
}

export async function loginAction({ email, password }: LoginCredentials) {
    const headerStore = await headers();
    const ip = headerStore.get("x-forwarded-for") ?? "127.0.0.1";

    const limit = checkRateLimit(ip);

    const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

    if (!limit.success) {
        return {
            success: false,
            error: `Too many failed attempts. Try again in ${limit.retryAfterMinutes} minutes.`,
        };
    }

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
        const refreshToken = result.data.refresh_token;

        const userResponse = await fetch(`${baseUrl}/users/me?fields=role.name`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const userResult = await userResponse.json();
        const roleName = userResult.data?.role?.name || "Member";

        const cookieStore = await cookies();

        const SEVEN_DAYS = 7 * 24 * 60 * 60;

        cookieStore.set("directus_token", token, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
            // Directus returns 'expires' in milliseconds (usually 900,000)
            // maxAge expects seconds
            maxAge: 15 * 60, // 15 minutes
        });

        cookieStore.set("directus_refresh_token", refreshToken, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
            // Match this to your Directus REFRESH_TOKEN_TTL (Default is 7 days)
            maxAge: 60 * 60 * 24 * 7,
        });

        cookieStore.set("user_role", roleName, {
            path: "/",
            httpOnly: true, // Still keep this true for security
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
            // Match this to the REFRESH token life so they expire together
            maxAge: SEVEN_DAYS,
        });

        return { success: true };
    } catch (err) {
        return { success: false, error: "System error. Please try again later." };
    }
}
