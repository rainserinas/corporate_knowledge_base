"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/login/actions";
import { toast } from "sonner";

export function LogoutButton() {
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            try {
                await logoutAction();
                toast.success("Logged out successfully");
            } catch (error) {
                // Redirects in server actions technically throw errors, 
                // but Next.js handles them. If it's a real error, catch it here.
                console.error(error);
            }
        });
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={handleLogout}
            className="text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
            <LogOut className={`mr-2 h-4 w-4 ${isPending ? "animate-pulse" : ""}`} />
            {isPending ? "Signing out..." : "Sign Out"}
        </Button>
    );
}