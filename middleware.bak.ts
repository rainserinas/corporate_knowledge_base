// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//     const { pathname } = request.nextUrl;

//     if (
//         pathname.startsWith("/_next") ||
//         pathname.startsWith("/static") ||
//         pathname.includes(".") ||
//         pathname === "/login"
//     ) {
//         return NextResponse.next();
//     }

//     const token = request.cookies.get("directus_token")?.value;
//     const refreshToken = request.cookies.get("directus_refresh_token")?.value;

//     if (!refreshToken) return NextResponse.next();

//     if (!token && refreshToken) {
//         if (request.headers.get("x-next-is-prefetch")) return NextResponse.next();

//         try {
//             const controller = new AbortController();
//             const timeoutId = setTimeout(() => controller.abort(), 5000);

//             const refreshResponse = await fetch(
//                 `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/auth/refresh`,
//                 {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ refresh_token: refreshToken, mode: "json" }),
//                     cache: "no-store",
//                     signal: controller.signal,
//                 }
//             );

//             clearTimeout(timeoutId);

//             if (refreshResponse.ok) {
//                 const result = await refreshResponse.json();
//                 const { access_token, refresh_token: newRefreshToken, expires } = result.data;

//                 const response = NextResponse.next();

//                 const cookieOptions = {
//                     path: "/",
//                     httpOnly: true,
//                     secure: process.env.NODE_ENV === "production",
//                     sameSite: "lax" as const,
//                 };

//                 response.cookies.set("directus_token", access_token, {
//                     ...cookieOptions,
//                     maxAge: expires / 1000,
//                 });

//                 response.cookies.set("directus_refresh_token", newRefreshToken, {
//                     ...cookieOptions,
//                     maxAge: 604800,
//                 });

//                 return response;
//             }
//         } catch (error) {
//             console.error("Middleware refresh failed:", error);

//             const response = NextResponse.next();
//             response.cookies.delete("directus_token");
//             response.cookies.delete("directus_refresh_token");
//             return response;
//         }
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };
