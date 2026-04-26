"use client";

import { useState, useTransition } from "react";
import { submitFeedbackAction } from "@/app/actions/feedback";
import { toast } from "sonner";
import { MessageSquarePlus, Send, Loader2, ChevronDown } from "lucide-react";

export default function FeedbackForm({ slug }: { slug: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // 1. Capture the form element
        const form = e.currentTarget;

        const formData = new FormData(form);

        formData.append("slug", slug);

        startTransition(async () => {
            const result = await submitFeedbackAction(Object.fromEntries(formData));
            if (result.success) {
                toast.success("Feedback received! Thank you.");
                setIsOpen(false);
            } else {
                toast.error(result.error);
            }
        });
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
            >
                <MessageSquarePlus className="h-4 w-4" />
                Suggest Feedback
            </button>
        );
    }

    return (
        <div className="mt-8 p-6 bg-slate-50 rounded-2xl border-2 border-indigo-100 animate-in fade-in zoom-in-95 duration-200">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    {/* Subject Dropdown */}
                    <div className="space-y-1.5">
                        <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                            Subject
                        </label>
                        <div className="relative">
                            <select
                                id="subject"
                                name="subject"
                                required
                                className="w-full h-12 pl-4 pr-10 bg-white border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-700 cursor-pointer"
                            >
                                <option value="Typo">Typo</option>
                                <option value="Outdated Info">Outdated Info</option>
                                <option value="Suggestion">Suggestion</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Message Area */}
                    <div className="space-y-1.5">
                        <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                            Feedback Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            required
                            placeholder="Describe the issue or suggestion..."
                            className="w-full min-h-[120px] p-4 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-700"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 text-slate-500 font-semibold hover:text-slate-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 shadow-sm transition-all"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Submit Feedback
                    </button>
                </div>
            </form>
        </div>
    );
}