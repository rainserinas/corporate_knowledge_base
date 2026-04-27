import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Library, Search, ChevronRight } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import { SearchInput } from "@/components/SearchInput";
import { cn } from "@/lib/utils";
import { ArticleCard } from "@/components/ArticleCard";
import { getValidToken } from "./lib/auth-refresh";
import { Pagination } from "@/components/Pagination";

async function getDashboardData(searchQuery?: string, categorySlug?: string, page: number = 1) {
	const token = await getValidToken();

	const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
	const limit = 6;

	const params = new URLSearchParams({
		fields: "id,title,slug,date_created,category.name,category.slug",
		"filter[status][_eq]": "Published",
		sort: "-date_created",
		// Pagination Params
		limit: limit.toString(),
		page: page.toString(),
		meta: "filter_count", // This is crucial for calculating total pages
	});

	if (searchQuery) {
		params.append("search", searchQuery);
	}

	if (categorySlug) {
		params.append("filter[category][slug][_eq]", categorySlug);
	}

	try {

		const [userRes, categoriesRes, articlesRes,] = await Promise.all([
			fetch(`${baseUrl}/users/me?fields=first_name,last_name,avatar,description,title`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				cache: "no-store"
			}),
			fetch(`${baseUrl}/items/categories?fields=id,name,slug`, {
				headers: { Authorization: `Bearer ${token}` },
				next: { revalidate: 30 },
			}),
			fetch(
				`${baseUrl}/items/articles?${params.toString()}`,
				{
					headers: { Authorization: `Bearer ${token}` },
					cache: "no-store"
				}
			)
		]);

		const categories = await categoriesRes.json();
		const articles = await articlesRes.json();
		const user = await userRes.json();

		if (articles?.errors) {
			if (articles?.errors[0].message == "Token expired.") {
				console.log("Token is expired");
			}
		}

		const totalCount = articles.meta?.filter_count || 0;

		return {
			categories: categories.data || [],
			articles: articles.data || [],
			user: user.data || null,
			totalCount: totalCount,
			totalPages: totalCount > 0 ? Math.ceil(totalCount / limit) : 1
		};
	} catch (error) {
		console.error("Dashboard Fetch Error:", error);
		return { categories: [], articles: [], user: null };
	}
}

export default async function HomePage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
	const query = (await searchParams).q;
	const activeCategory = (await searchParams).category;
	const { page } = await searchParams;
	const currentPage = Number(page) || 1;
	const { categories, articles, user, totalPages } = await getDashboardData(query, activeCategory, currentPage);
	const displayName = user?.first_name ? `${user.first_name} ${user.last_name || ""}` : "Team Member";

	return (
		<div className="min-h-screen bg-[#F8FAFC]">
			{/* Nav */}
			<header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-xl">
				<div className="container mx-auto flex h-16 items-center justify-between px-6">
					<Link href="/" className="flex items-center gap-2.5">
						<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 shadow-indigo-200 shadow-lg">
							<Library className="h-5 w-5 text-white" />
						</div>
						<span className="text-lg font-bold tracking-tight text-slate-900">
							Corporate KB
						</span>
					</Link>
					<nav className="flex items-center gap-6">
						{/* Added Link */}
						<Link
							href="/manage"
							className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
						>
							My Knowledge Base
						</Link>
						<LogoutButton />
					</nav>
				</div>
			</header>

			<main className="container mx-auto max-w-6xl px-6 py-12">
				{/* Search Hero */}
				<section className="mb-16 space-y-8">
					<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
						<div className="space-y-4">
							<div className="space-y-1">
								<h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
									Hi, <span className="text-indigo-600">{user?.first_name || "there"}!</span>
								</h1>
								<p className="text-lg text-slate-500 max-w-2xl">
									Welcome back to the <span className="font-semibold text-slate-700">Corporate Knowledge Base</span>.
									Everything is synced and up to date.
								</p>
							</div>
						</div>

						{/* Visual User ID Card (The "Better UI" suggestion) */}
						<div className="hidden lg:flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
							<div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-indigo-600 font-bold border border-slate-200">
								{user?.first_name?.[0] || "U"}
							</div>
							<div className="flex flex-col">
								<span className="text-sm font-bold text-slate-900">{displayName}</span>
								<span className="text-[10px] font-medium uppercase text-slate-400 tracking-tight">
									{user?.title || "Senior Staff"}
								</span>
							</div>
						</div>
					</div>

					<div className="relative max-w-2xl group">
						<SearchInput />
					</div>
				</section>

				<div className="grid gap-12 lg:grid-cols-[260px_1fr]">
					{/* Categories Sidebar */}
					<aside className="hidden lg:block space-y-8">
						<div>
							<h3 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
								Categories
							</h3>
							<div className="flex flex-col gap-1">
								<Link
									href="/"
									className={cn(
										"flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all hover:bg-white active:scale-[0.98]",
										!activeCategory ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600"
									)}
								>
									All Articles
								</Link>

								{categories.map((cat: any) => {
									const isActive = activeCategory === cat.slug;
									return (
										<Link
											key={cat.id}
											href={`/?category=${cat.slug}${query ? `&q=${query}` : ""}`} // Preserve search if active
											className={cn(
												"group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all hover:bg-white active:scale-[0.98]",
												isActive
													? "bg-white text-indigo-600 shadow-sm"
													: "text-slate-600 hover:text-indigo-600"
											)}
										>
											{cat.name}
											<ChevronRight className={cn(
												"h-4 w-4 transition-all",
												isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
											)} />
										</Link>
									);
								})}
							</div>
						</div>
					</aside>

					{/* Articles List */}
					<section className="space-y-6">
						<div className="flex items-center justify-between border-b border-slate-200 pb-4">
							<h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
								Recent Articles
							</h3>
							<span className="text-xs font-medium text-slate-400">
								{articles.length} items found
							</span>
						</div>

						<div className="grid gap-6">
							{articles.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
									<div className="p-4 bg-white rounded-full shadow-sm mb-4">
										<Search className="h-8 w-8 text-slate-300" />
									</div>
									<h3 className="text-lg font-bold text-slate-900">No results found</h3>
									<p className="text-slate-500 mb-6">Try adjusting your filters or search terms.</p>
									<Link href="/" className="text-sm font-bold text-indigo-600 hover:underline">
										Clear all filters
									</Link>
								</div>
							) : (
								<div className="grid gap-6">
									{articles.map((article: any) => (
										<ArticleCard key={article.id} article={article} />
									))}

									<Pagination
										currentPage={currentPage}
										totalPages={totalPages}
									/>
								</div>
							)}
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
