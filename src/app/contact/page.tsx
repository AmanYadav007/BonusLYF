"use client";

import { Header } from "@/components/layout/header";
import { Mail, MessageCircle, Twitter, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { sendContactEmail } from "@/app/actions/send-email";

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(formData: FormData) {
        setStatus('loading');
        setErrorMessage('');

        const result = await sendContactEmail(formData);

        if (result.error) {
            setStatus('error');
            setErrorMessage(result.error);
        } else {
            setStatus('success');
            // Reset form by reloading page or simple reset if managed. 
            // Since we use native FormData, the inputs don't clear automatically unless we control them or reset form ref.
            // Easy way: just show success state permanently or reset via simple DOM if needed.
        }
    }

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
                                    <a href="mailto:aman.yadav@bonuslyf.com" className="text-muted-foreground hover:text-violet-500 transition-colors">aman.yadav@bonuslyf.com</a>
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

                    {/* Right Column: Form */}
                    <div className="bg-muted/5 border border-border/50 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
                        {status === 'success' ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-background/50 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                <p className="text-muted-foreground">Thanks for reaching out. We'll get back to you shortly.</p>
                                <Button
                                    className="mt-6"
                                    variant="outline"
                                    onClick={() => setStatus('idle')}
                                >
                                    Send another
                                </Button>
                            </div>
                        ) : null}

                        <form action={handleSubmit} className={`space-y-4 transition-opacity duration-300 ${status === 'success' ? 'opacity-0 pointer-events-none' : ''}`}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground ml-1" htmlFor="name">Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Your name"
                                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-violet/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground ml-1" htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-violet/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground ml-1" htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    required
                                    placeholder="How can we help?"
                                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-violet/20 resize-none"
                                />
                            </div>

                            {status === 'error' && (
                                <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg border border-red-200 dark:border-red-900">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errorMessage || 'Something went wrong. Please try again.'}</span>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full rounded-xl bg-foreground text-background hover:bg-foreground/90 h-10 font-medium disabled:opacity-70"
                            >
                                {status === 'loading' ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
