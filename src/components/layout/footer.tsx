import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-background border-t border-border py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-violet to-cyan flex items-center justify-center">
                                <span className="text-white font-bold text-[10px]">B</span>
                            </div>
                            <span className="font-display font-bold text-lg tracking-tight">BonusLYF</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Digital companions designed for presence, connection, and emotional intelligence.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-medium text-foreground mb-4">Product</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    How it works
                                </Link>
                            </li>
                            <li>
                                <Link href="/#companions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Companions
                                </Link>
                            </li>
                            <li>
                                <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-medium text-foreground mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-medium text-foreground mb-4">Legal</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground text-center md:text-left">
                        © {new Date().getFullYear()} BonusLYF. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {/* Social icons or extra small links could go here */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
