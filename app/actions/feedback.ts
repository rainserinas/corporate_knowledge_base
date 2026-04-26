"use server";

import { cookies } from "next/headers";
import { getValidToken } from "../lib/auth-refresh";

export async function submitFeedbackAction(data: any) {
    const cookieStore = await cookies();
    const token = await getValidToken();
    const userRole = cookieStore.get("user_role")?.value;

    // Security Gate: Only Members can submit
    if (userRole !== "Member" || !token) {
        return { success: false, error: "Unauthorized" };
    }

    const content = data.message as string;
    const slug = data.slug as string;
    const subject = data.subject as string;

    console.log(content, slug, subject, "Form Data");

    if (!content || content.length < 10) {
        return { success: false, error: "Feedback must be at least 10 characters." };
    }

    try {
        const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

        const articleData = await fetch(
            `${baseUrl}/items/articles?fields=id&filter[slug][_eq]=${slug}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                cache: "no-store",
            }
        );

        const articleDetails = await articleData.json();
        console.log(articleDetails.data[0].id, "Article ID");
        const response = await fetch(`${baseUrl}/items/feedbacks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                article_id: articleDetails.data[0].id,
                message: content,
                subject: subject,
                //status: "New",
            }),
        });

        if (!response.ok) throw new Error("Failed to save feedback");

        return { success: true };
    } catch (error) {
        return { success: false, error: "Could not submit feedback. Try again later." };
    }
}
