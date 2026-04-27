"use client";

import { useState, useEffect } from "react";
import { Plus, X, Loader2, Image as ImageIcon, FileEdit } from "lucide-react";
import { createArticle, updateArticle } from "@/app/actions/generalAction";
import { toast } from "sonner";
import { TiptapEditor } from "./TiptapEditor";

export function ArticleModal({
    initialData,
    categories,
    mode = "create"
}: {
    categories: any[],
    initialData?: any,
    mode?: "create" | "edit"
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        status: initialData?.status || "Draft",
        content: initialData?.content || "",
        category: initialData?.category?.name || ""
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                slug: initialData.slug,
                status: initialData.status,
                content: initialData.content,
                category: initialData.category?.id || initialData.category
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const cleanData = {
            title: formData.title,
            slug: formData.slug,
            status: formData.status,
            content: formData.content,
            category: formData.category // This is now the UUID string
        };

        try {
            if (mode === "edit") {
                await updateArticle(initialData.id, cleanData);
                toast.success("Article updated");
            } else {
                await createArticle(cleanData);
                toast.success("Article created");
            }
            setIsOpen(false);
        } catch (error: any) {
            // Log the specific error message from the Server Action
            toast.error(error.message || "Failed to save article");
        } finally {
            setLoading(false);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;

        // Generate the slug directly from the new title
        const generatedSlug = newTitle
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");

        // Update both in ONE state call (avoids cascading renders)
        setFormData((prev) => ({
            ...prev,
            title: newTitle,
            slug: generatedSlug
        }));
    };

    return (

        <>
            {mode === "create" ? (
                <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95">Create New</button>
            ) : (
                <button onClick={() => setIsOpen(true)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <FileEdit className="h-4 w-4" />
                </button>
            )}

            {isOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">

                    {/* Modal Card - Set to max 90% of screen height */}
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">

                        {/* Header - Fixed */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                            <div>

                                {mode === "create" ? (
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800">New Documentation</h2>
                                        <p className="text-xs text-slate-500">Add a new entry to your knowledge base.</p>
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800 text-left">Update Documentation</h2>
                                        <p className="text-xs text-slate-500">Update this entry to your knowledge base.</p>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Form Body - The Scrollable Area */}
                        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">

                            {/* Inner Content - Scrollable */}
                            <div className="p-6 space-y-5 overflow-y-auto min-h-0 flex-1 custom-scrollbar">
                                <div className="grid grid-cols-2 gap-4 text-left">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
                                        <select
                                            className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-sm focus:ring-2 ring-indigo-50 outline-none"
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="Draft">Draft</option>
                                            <option value="Published">Published</option>
                                            <option value="Archived">Archived</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                                        <select
                                            required
                                            className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-sm focus:ring-2 ring-indigo-50 outline-none"
                                            value={formData.category} // This should be an ID state
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}> {/* Ensure value is cat.id, NOT cat.name */}
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5 text-left">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Title</label>
                                    <input
                                        required
                                        placeholder="E.g. How to set up your environment"
                                        className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 ring-indigo-50 outline-none transition-all"
                                        value={formData.title}
                                        onChange={handleTitleChange}
                                    />
                                </div>

                                <div className="space-y-1.5 text-left">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Slug (Auto-generated)</label>
                                    <div className="flex items-center px-3 py-2.5 border border-slate-100 rounded-xl bg-slate-50 text-slate-500 text-xs font-mono">
                                        <span className="opacity-50 select-none">/articles/</span>
                                        {formData.slug}
                                    </div>
                                </div>

                                <div className="space-y-1.5 text-left">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Content</label>
                                    <TiptapEditor
                                        content={formData.content}
                                        onChange={(html) => setFormData({ ...formData, content: html })}
                                    />
                                </div>

                                {/* Bottom spacer to prevent the last field from touching the footer */}
                                <div className="h-2" />
                            </div>

                            {/* Footer - Fixed Button Area */}
                            <div className="p-6 border-t border-slate-100 bg-slate-50/50 shrink-0">
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="flex-1 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-indigo-100 transition-all"
                                    >
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Article"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}