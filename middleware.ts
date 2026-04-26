import { NextResponse } from "next/server";
//import type { NextRequest } from "next/request";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const token = request.cookies.get("directus_token")?.value;
    const refreshToken = request.cookies.get("directus_refresh_token")?.value;

    // If access token is missing but we have a refresh token...
    if ((!token && refreshToken) || isTokenExpired(token as string)) {
        try {
            const refreshResponse = await fetch(
                `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/auth/refresh`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh_token: refreshToken, mode: "json" }),
                }
            );

            const result = await refreshResponse.json();

            if (refreshResponse.ok && result.data) {
                const { access_token, refresh_token: newRefreshToken, expires } = result.data;

                // Set the new cookies on the response
                response.cookies.set("directus_token", access_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: expires / 1000,
                    path: "/",
                });

                response.cookies.set("directus_refresh_token", newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 604800,
                    path: "/",
                });

                return response;
            }
        } catch (error) {
            console.error("Middleware refresh failed:", error);
        }
    }

    return response;
}

// Ensure middleware only runs on page routes, not images/static files
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

function isTokenExpired(token: string) {
    try {
        // Decode the payload (middle part of the JWT)
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiry = payload.exp; // This is in seconds
        const now = Math.floor(Date.now() / 1000);

        return now >= expiry;
    } catch (e) {
        return true; // If decoding fails, treat it as expired
    }
}
