import { cookies } from "next/headers";

let refreshPromise: Promise<boolean> | null = null;

async function performRefresh() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("directus_refresh_token")?.value;

    if (!refreshToken) return false;

    try {
        // IMPORTANT: Notice there is NO Authorization header here.
        // Sending an expired Bearer token to the refresh endpoint
        // can sometimes trigger a 401 before the refresh logic runs.
        const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // DO NOT put the expired access token here
            },
            body: JSON.stringify({
                refresh_token: refreshToken,
                mode: "json",
            }),
        });

        if (!response.ok) {
            // If this is false, it means the Refresh Token itself is expired
            // (e.g., more than 7 days have passed) or it was already used.
            return false;
        }

        const { data } = await response.json();

        const accessTokenOptions = {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
            // Directus access_token default is 15 mins (900 seconds)
            maxAge: 15 * 60,
        };

        const refreshTokenOptions = {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
            // Directus refresh_token default is 7 days
            maxAge: 7 * 24 * 60 * 60,
        };

        // IMMEDIATELY save the NEW refresh token.
        // If you don't do this, the next attempt will fail.
        cookieStore.set("directus_token", data.access_token, accessTokenOptions);
        cookieStore.set("directus_refresh_token", data.refresh_token, refreshTokenOptions);

        return true;
    } catch (error) {
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
