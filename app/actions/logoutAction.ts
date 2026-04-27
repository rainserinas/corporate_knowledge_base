"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
    const cookieStore = await cookies();

    cookieStore.delete("directus_token");
    cookieStore.delete("user_role");

    redirect("/login");
}
