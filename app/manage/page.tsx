import { getValidToken } from "@/app/lib/auth-refresh";
import Link from "next/link";
import { Library } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import { ManageTable } from "@/components/ManageTable";
import { ArticleModal } from "@/components/ArticleModal";

export default async function ManageKBPage() {
    const token = await getValidToken();
    const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

    const [articlesRes, catRes] = await Promise.all([
        fetch(`${baseUrl}/items/articles?fields=id,title,status,date_created,category.name,slug,content`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store"
        }),
        fetch(`${baseUrl}/items/categories?fields=id,name`, {
            headers: { Authorization: `Bearer ${token}` }
        })
    ]);

    const { data: articles } = await articlesRes.json();
    const { data: categories } = await catRes.json();

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-xl">
                <div className="container mx-auto flex h-16 items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2.5 group hover:opacity-80 transition-opacity">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 shadow-indigo-200 shadow-lg group-hover:scale-105 transition-transform">
                            <Library className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-slate-900">
                            Corporate KB
                        </span>
                    </Link>

                    <nav className="flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                        >
                            Dashboard
                        </Link>


                        <LogoutButton />
                    </nav>
                </div>
            </header>
            <div className="container mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">My Knowledge Base</h1>
                        <p className="text-slate-500 text-sm">Manage, edit, and create new documentation.</p>
                    </div>

                    <ArticleModal categories={categories} />
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <ManageTable initialArticles={articles} initialCategories={categories} />
                </div>
            </div>
        </>
    );
}