import { ArrowLeft, Calendar, Tag, User } from "lucide-react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { format } from "date-fns";
import { getValidToken } from "@/app/lib/auth-refresh";
import { authenticatedFetch } from "@/app/lib/directus-client";
import { TiptapRenderer } from "@/components/TiptapEditor";
import { Navbar } from "@/components/Navbar";

export default async function ArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const slug = (await params).slug;
    const article = await getArticleData(slug);
    const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

    if (!article) notFound();

    const formattedContent = article.content.replace(
        /src="\/assets\//g,
        `src="${baseUrl}/assets/`
    );

    const userRes = await authenticatedFetch(`${baseUrl}/users/me?fields=id,first_name,last_name,avatar,description,title,role`, {
        cache: "no-store"
    });
    const { data: user } = await userRes.json();

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            {/* Navigation Header */}
            <Navbar user={user} />

            <article className="container mx-auto max-w-4xl px-6 pt-12">
                {/* Header Meta */}
                <header className="mb-10 space-y-6">
                    {article.category && (
                        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
                            <Tag className="h-3 w-3" />
                            {article.category.name}
                        </div>
                    )}

                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 border-b border-slate-200 pb-8">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(article.date_created), "MMMM dd, yyyy")}
                        </div>
                        {article.user_created && (
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {article.user_created.first_name} {article.user_created.last_name}
                            </div>
                        )}
                    </div>
                </header>

                <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200">
                    <TiptapRenderer content={formattedContent} />
                </div>
            </article>
        </main>
    );
}

async function getArticleData(slug: string) {
    const token = await getValidToken();
    if (!token) redirect("/login");

    const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

    const response = await authenticatedFetch(
        `${baseUrl}/items/articles?filter[slug][_eq]=${slug}&fields=title,content,date_created,category.name,user_created.first_name,user_created.last_name,slug`,
        {
            cache: "no-store",
        }
    );

    const result = await response.json();
    return result.data?.[0] || null;
}