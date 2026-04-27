import { cookies } from "next/headers";

let refreshPromise: Promise<boolean> | null = null;

async function performRefresh() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("directus_refresh_token")?.value;

    if (!refreshToken) return false;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken, mode: "json" }),
        });

        if (!response.ok) throw new Error("Refresh failed");

        const { data } = await response.json();

        cookieStore.set("directus_token", data.access_token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
        });
        cookieStore.set("directus_refresh_token", data.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
        });

        return true;
    } catch (error) {
        console.error("Token Refresh Error:", error);
        return false;
    }
}

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
    const cookieStore = await cookies();

    const execute = async () => {
        const token = cookieStore.get("directus_token")?.value;
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
    };

    let response = await execute();

    if (response.status == 401) {
        if (!refreshPromise) {
            refreshPromise = performRefresh();
        }

        const success = await refreshPromise;

        refreshPromise = null;

        if (success) {
            response = await execute();
        } else {
            console.warn("Session expired. User needs to re-login.");
        }
    }

    return response;
}
