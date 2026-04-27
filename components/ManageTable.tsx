"use client";

import { useState } from "react";
import { FileEdit, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { archiveArticle } from "@/app/actions/generalAction";
import { toast } from "sonner";
import { ArticleModal } from "./ArticleModal";

export function ManageTable({ initialArticles, initialCategories }: { initialArticles: any[], initialCategories: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | number | null>(null);
    const [isArchiving, setIsArchiving] = useState(false);

    const openConfirmModal = (id: string | number) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };

    const handleConfirm = async () => {
        if (!selectedId) return;
        setIsArchiving(true);

        try {
            const result = await archiveArticle(selectedId);

            if (result.success) {
                toast.success("Article successfully moved to archives", {
                    description: "This item will no longer appear on the public dashboard.",
                });
                setIsModalOpen(false);
            }
        } catch (error) {
            toast.error("Failed to archive article", {
                description: "Please check your connection and try again.",
            });
        } finally {
            setIsArchiving(false);
            setSelectedId(null);
        }
    };

    return (
        <>
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {initialArticles.map((article) => (
                        <tr key={article.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">{article.title}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{article.category?.name || 'Uncategorized'}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${article.status === 'Published' ? 'bg-emerald-100 text-emerald-700' :
                                    article.status === 'Draft' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {article.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                                <ArticleModal
                                    mode="edit"
                                    initialData={article}
                                    categories={initialCategories}
                                />

                                <button
                                    onClick={() => openConfirmModal(article.id)}
                                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Confirmation Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 text-amber-600 mb-4">
                            <AlertCircle className="h-6 w-6" />
                            <h3 className="text-lg font-bold text-slate-900">Archive Article?</h3>
                        </div>

                        <p className="text-slate-500 text-sm mb-6">
                            Are you sure you want to archive this knowledge base? It will no longer be visible on the public dashboard.
                        </p>

                        <div className="flex gap-3">
                            <button
                                disabled={isArchiving}
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isArchiving}
                                onClick={handleConfirm}
                                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                            >
                                {isArchiving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}