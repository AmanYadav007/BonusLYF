import { Header } from "@/components/layout/header";
import { Mail, MessageCircle, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <Header />

            <main className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 container mx-auto max-w-4xl">
                <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
                    {/* Left Column: Text */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-display font-medium mb-4">Let's Talk.</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Whether you have a question about features, pricing, or just want to say hi, we're here.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-full bg-violet/10 flex items-center justify-center text-violet-500 group-hover:scale-110 transition-transform">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">Email Us</h3>
                                    <a href="mailto:support@bonuslyf.com" className="text-muted-foreground hover:text-violet-500 transition-colors">support@bonuslyf.com</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-full bg-cyan/10 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                                    <Twitter className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">Twitter / X</h3>
                                    <a href="https://twitter.com/BonusLYF" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cyan-500 transition-colors">@BonusLYF</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-full bg-emerald/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">Community</h3>
                                    <a href="#" className="text-muted-foreground hover:text-emerald-500 transition-colors">Join our Discord (Coming Soon)</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form (Visual Only) */}
                    <div className="bg-muted/5 border border-border/50 rounded-3xl p-8 backdrop-blur-sm">
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground ml-1">Name</label>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-violet/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground ml-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-violet/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground ml-1">Message</label>
                                <textarea
                                    rows={4}
                                    placeholder="How can we help?"
                                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-violet/20 resize-none"
                                />
                            </div>
                            <Button className="w-full rounded-xl bg-foreground text-background hover:bg-foreground/90 h-10 font-medium">
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
