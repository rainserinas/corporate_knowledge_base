"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Library, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils"; // Standard shadcn helper or use template literals
import { LogoutButton } from "@/components/LogoutButton";

const navLinks = [
    { name: "My Knowledge Base", href: "/manage" }
];

export function Navbar({ user }: { user: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-6">

                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-200">
                        <Library className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-900">
                        Corporate KB
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        // Check if the link requires "Team Leads" and if the user matches
                        if (user.role.name !== "Team Leads") {
                            return null;
                        }

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-indigo-600",
                                    pathname === link.href ? "text-indigo-600" : "text-slate-600"
                                )}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                    <LogoutButton />
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="block md:hidden text-slate-600"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div className="absolute top-16 left-0 w-full border-b bg-white p-6 md:hidden flex flex-col gap-4 shadow-xl">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "text-base font-medium",
                                pathname === link.href ? "text-indigo-600" : "text-slate-600"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <hr className="border-slate-100" />
                    <LogoutButton />
                </div>
            )}
        </header>
    );
}