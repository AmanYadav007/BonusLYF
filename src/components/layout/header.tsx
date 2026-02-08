"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-background/80 backdrop-blur-xl border-b border-border/40"
                : "bg-transparent py-4"
                }`}
        >
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        {/* Logo Icon Placeholder - Orb/Spark */}
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet to-cyan flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                            <span className="text-white font-bold text-sm">B</span>
                        </div>
                        <span className="font-display font-bold text-xl tracking-wide text-foreground group-hover:text-primary transition-colors">
                            BonusLYF
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-10">
                        <Link
                            href="/about"
                            className="text-sm font-medium text-muted-foreground/80 hover:text-foreground transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="/pricing"
                            className="text-sm font-medium text-muted-foreground/80 hover:text-foreground transition-colors"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/company"
                            className="text-sm font-medium text-muted-foreground/80 hover:text-foreground transition-colors"
                        >
                            Company
                        </Link>
                        <Link
                            href="/contact"
                            className="text-sm font-medium text-muted-foreground/80 hover:text-foreground transition-colors"
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Sign In
                        </Link>
                        <Button asChild className="rounded-full bg-gradient-to-r from-violet to-cyan text-white font-medium px-6 hover:shadow-[0_0_20px_-5px_rgba(79,209,197,0.5)] hover:scale-105 transition-all duration-300 border-0">
                            <Link href="/register">Get Started Free</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden flex items-center gap-4">
                        <Button asChild size="sm" className="rounded-full bg-gradient-to-r from-violet to-cyan text-white border-0 font-medium hover:shadow-lg transition-all">
                            <Link href="/register">Get Started</Link>
                        </Button>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="-mr-2 hover:bg-transparent">
                                    <Menu className="w-7 h-7 text-foreground" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-full sm:w-[350px] p-0 border-l border-border/50 bg-background/95 backdrop-blur-xl">
                                <div className="flex flex-col h-full p-8 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <span className="font-display font-bold text-2xl tracking-wide">BonusLYF</span>
                                        {/* Sheet close is handled by the component */}
                                    </div>
                                    <nav className="flex flex-col gap-6">
                                        <Link href="/about" className="text-2xl font-medium text-foreground/80 hover:text-foreground transition-colors">About</Link>
                                        <Link href="/pricing" className="text-2xl font-medium text-foreground/80 hover:text-foreground transition-colors">Pricing</Link>
                                        <Link href="/company" className="text-2xl font-medium text-foreground/80 hover:text-foreground transition-colors">Company</Link>
                                        <Link href="/contact" className="text-2xl font-medium text-foreground/80 hover:text-foreground transition-colors">Contact</Link>
                                        <div className="h-px bg-border/50 my-4" />
                                        <Link href="/login" className="text-2xl font-medium text-foreground/80 hover:text-foreground transition-colors">Sign In</Link>
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
