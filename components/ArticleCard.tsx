import Link from "next/link";
import { ChevronRight, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";

interface Article {
    id: string;
    title: string;
    slug: string;
    date_created: string;
    category?: {
        name: string;
    };
}

export function ArticleCard({ article }: { article: Article }) {
    return (
        <Link
            href={`/article/${article.slug}`}
            className="group block p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all active:scale-[0.99]"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                    {article.category && (
                        <div className="flex items-center gap-1.5">
                            <Tag className="h-3 w-3 text-indigo-500" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                                {article.category.name}
                            </span>
                        </div>
                    )}

                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {article.title}
                    </h2>

                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(article.date_created), "MMMM dd, yyyy")}</span>
                        </div>
                    </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                    <ChevronRight className="h-5 w-5" />
                </div>
            </div>
        </Link>
    );
}