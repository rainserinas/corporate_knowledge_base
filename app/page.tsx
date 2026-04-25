import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Library, Search, Clock, Layers, ChevronRight, FileText, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { SearchInput } from "@/components/search-input";

async function getDashboardData(searchQuery?: string) {
	const cookieStore = await cookies();
	const token = cookieStore.get("directus_token")?.value;

	// If no session, go to login
	if (!token) redirect("/login");

	const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
	const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";
	console.log(searchParam);
	try {
		const [categoriesRes, articlesRes] = await Promise.all([
			fetch(`${baseUrl}/items/categories?fields=id,name,slug`, {
				headers: { Authorization: `Bearer ${token}` },
				next: { revalidate: 30 }, // Cache for 30 seconds
			}),
			fetch(
				`${baseUrl}/items/articles?fields=id,title,slug,date_created,category.name&filter[status][_eq]=Published&sort=-date_created${searchParam}`,
				{
					headers: { Authorization: `Bearer ${token}` },
					next: { revalidate: 30 },
				}
			),

			// fetch(`${baseUrl}/items/articles?fields=id,title,slug,date_created,category.name&filter[status][_eq]=Published&sort=-date_created${searchParam}`, {
			// 	headers: { Authorization: `Bearer ${token}` },
			// 	cache: "no-store" // Ensure fresh results during search
			// })
		]);

		if (categoriesRes.status === 401) redirect("/login");

		const categories = await categoriesRes.json();
		const articles = await articlesRes.json();

		console.log(articles);

		return {
			categories: categories.data || [],
			articles: articles.data || [],
		};
	} catch (error) {
		console.error("Dashboard Fetch Error:", error);
		return { categories: [], articles: [] };
	}
}

export default async function HomePage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>;
}) {
	const query = (await searchParams).q;
	const { categories, articles } = await getDashboardData(query);

	return (
		<div className="min-h-screen bg-[#F8FAFC]">
			{/* Nav */}
			<header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-xl">
				<div className="container mx-auto flex h-16 items-center justify-between px-6">
					<div className="flex items-center gap-2.5">
						<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 shadow-indigo-200 shadow-lg">
							<Library className="h-5 w-5 text-white" />
						</div>
						<span className="text-lg font-bold tracking-tight text-slate-900">
							Corporate KB
						</span>
					</div>
					<nav className="flex items-center gap-6">
						<LogoutButton />
					</nav>
				</div>
			</header>

			<main className="container mx-auto max-w-6xl px-6 py-12">
				{/* Search Hero */}
				<section className="mb-16 space-y-6 text-center sm:text-left">
					<div className="space-y-2">
						<h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
							Knowledge Base
						</h1>
						<p className="text-lg text-slate-500 max-w-2xl">
							Access documentation, technical specifications, and company protocols.
						</p>
					</div>
					<div className="relative max-w-2xl group">
						<section className="mb-16">
							<SearchInput />
						</section>
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
								{categories.map((cat: any) => (
									<Link
										key={cat.id}
										href={`/category/${cat.slug}`}
										className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-white hover:text-indigo-600 hover:shadow-sm active:scale-[0.98]"
									>
										{cat.name}
										<ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
									</Link>
								))}
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
							{articles.map((article: any) => (
								<Link
									key={article.id}
									href={`/articles/${article.slug}`}
									className="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100"
								>
									<div className="flex items-start justify-between">
										<div className="space-y-3">
											<Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-none px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
												{article.category?.name}
											</Badge>
											<h2 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
												{article.title}
											</h2>
											<div className="flex items-center gap-4 text-[12px] text-slate-400 font-medium">
												<span className="flex items-center gap-1.5 font-mono">
													<FileText className="h-3.5 w-3.5" />
													ID: {article.slug.substring(0, 6)}
												</span>
												<span>•</span>
												<span>
													{new Date(
														article.date_created
													).toLocaleDateString("en-US", {
														month: "long",
														day: "numeric",
														year: "numeric",
													})}
												</span>
											</div>
										</div>
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-300 transition-all group-hover:bg-indigo-600 group-hover:text-white">
											<ArrowRight className="h-5 w-5" />
										</div>
									</div>
								</Link>
							))}
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
