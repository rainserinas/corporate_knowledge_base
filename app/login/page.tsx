"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Loader2, ShieldCheck, Library, Eye, EyeOff, } from "lucide-react";
import { loginAction } from "../actions/loginAction";
import { getValidToken } from "../lib/auth-refresh";


export default function LoginPage() {
    const [isPending, startTransition] = useTransition();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const verifySession = async () => {
            const token = await getValidToken();

            if (token) {
                router.push("/");
            }
        };

        verifySession();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            const result = await loginAction({ email, password });

            if (result.success) {
                toast.success("Welcome back!");
                router.push("/");
                router.refresh();
            } else {
                toast.error("Access Denied", { description: result.error });
            }
        });
    };

    return (
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
            {/* Left Side: Professional Identity */}
            <div className="relative hidden flex-col bg-slate-950 p-10 text-white lg:flex justify-between border-r border-slate-800">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

                <div className="relative z-20 flex items-center gap-3 text-xl font-semibold tracking-tight">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-600 shadow-lg shadow-indigo-500/20">
                        <Library className="h-6 w-6 text-white" />
                    </div>
                    <span>Corporate KB</span>
                </div>

                <div className="relative z-20">
                    <div className="space-y-4 max-w-md">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
                            <ShieldCheck className="h-3 w-3" />
                            Secure Enterprise Access
                        </div>
                        <h2 className="text-4xl font-bold leading-tight">
                            Centralized intelligence for modern teams.
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Access technical documentation, company protocols, and internal resources in one secure environment.
                        </p>
                    </div>
                </div>

                <div className="relative z-20 text-sm text-slate-500 font-mono">
                    &copy; {new Date().getFullYear()} Internal Systems Division
                </div>
            </div>

            {/* Right Side: Clean Login Interface */}
            <div className="flex items-center justify-center p-8 bg-white dark:bg-slate-950">
                <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px]">
                    <div className="flex flex-col space-y-2 text-center sm:text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sign In</h1>
                        <p className="text-sm text-slate-500">
                            Use your employee credentials to access the internal repository.
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john.doe@company.com"
                                        className="pl-10 h-12 border-slate-200 focus-visible:ring-indigo-600 rounded-lg"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Password
                                    </Label>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />

                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10 h-12 border-slate-200 focus-visible:ring-indigo-600 rounded-lg"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                        className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button
                                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    "Enter Workspace"
                                )}
                            </Button>
                        </form>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
                        <p className="text-[11px] text-center text-slate-500 leading-relaxed uppercase tracking-widest font-medium">
                            System notice: Your IP is being logged for security auditing purposes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}