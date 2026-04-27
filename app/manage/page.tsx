import { getValidToken } from "@/app/lib/auth-refresh";
import { ManageTable } from "@/components/ManageTable";
import { ArticleModal } from "@/components/ArticleModal";
import { Navbar } from "@/components/Navbar";
import { authenticatedFetch } from "../lib/directus-client";
import { redirect } from "next/navigation";

export default async function ManageKBPage() {
    const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
    await getValidToken();
    const userRes = await authenticatedFetch(`${baseUrl}/users/me?fields=id,first_name,last_name,avatar,description,title,role.name`, {
        cache: "no-store"
    });
    const { data: user } = await userRes.json();

    if (user.role.name !== "Team Leads") {
        redirect('/');
    }

    const [articlesRes, categoriesRes] = await Promise.all([

        authenticatedFetch(`${baseUrl}/items/articles?fields=id,title,status,date_created,category.name, category.id,slug,content&filter[user_created][_eq]=${user.id}`, {
            cache: "no-store"
        }),
        authenticatedFetch(`${baseUrl}/items/categories?fields=id,name`, {
        })
    ]);

    const { data: categories } = await categoriesRes.json();
    const { data: articles } = await articlesRes.json();

    return (
        <>
            <Navbar user={user} />
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