"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce"; // npm install use-debounce

export function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get the initial search term from the URL (if it exists)
    const initialQuery = searchParams.get("q") || "";
    const [text, setText] = useState(initialQuery);

    // Wait 300ms after the user stops typing before searching
    const [query] = useDebounce(text, 300);

    useEffect(() => {
        if (!query) {
            router.push("/");
        } else {
            router.push(`/?q=${query}`);
        }
    }, [query, router]);

    return (
        <div className="relative max-w-2xl group">
            <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Search by topic, keyword, or category..."
                className="h-14 pl-12 rounded-2xl border-slate-200 bg-white shadow-xl shadow-slate-200/50 focus-visible:ring-indigo-600 text-base"
            />
        </div>
    );
}