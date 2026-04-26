import { ArrowLeft, Calendar, Tag, User, MessageSquarePlus, Lightbulb, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { format } from "date-fns";
import FeedbackForm from "@/components/FeedbackForm";
import { getValidToken } from "@/app/lib/auth-refresh";

export default async function ArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const slug = (await params).slug;
    const article = await getArticleData(slug);
    const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
    const cookieStore = await cookies();
    const userRole = cookieStore.get("user_role")?.value;

    if (!article) notFound();

    const formattedContent = article.content.replace(
        /src="\/assets\//g,
        `src="${baseUrl}/assets/`
    );

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            {/* Navigation Header */}
            <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 max-w-4xl items-center px-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Knowledge Base
                    </Link>
                </div>
            </nav>

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
                    <div
                        className="prose prose-slate prose-indigo max-w-none"
                        dangerouslySetInnerHTML={{ __html: formattedContent }}
                    />

                    {/* MEMBER FEEDBACK SECTION */}
                    {userRole === "Member" && (
                        <div className="mt-16 p-8 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col md:flex-row items-center gap-6">
                            <div className="bg-white p-3 rounded-xl shadow-sm">
                                <Lightbulb className="h-6 w-6 text-indigo-600" />
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-lg font-bold text-slate-900">Have a suggestion?</h3>
                                <p className="text-sm text-slate-600">
                                    As a team member, you can suggest edits or provide feedback to improve this documentation.
                                </p>
                            </div>

                            <FeedbackForm slug={article.slug} />
                        </div>
                    )}
                </div>
            </article>
        </main>
    );
}

async function getArticleData(slug: string) {
    const token = await getValidToken();
    if (!token) redirect("/login");

    const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

    const response = await fetch(
        `${baseUrl}/items/articles?filter[slug][_eq]=${slug}&fields=title,content,date_created,category.name,user_created.first_name,user_created.last_name,slug`,
        {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        }
    );

    const result = await response.json();
    return result.data?.[0] || null;
}