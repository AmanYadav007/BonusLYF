"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Shield, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { motion } from "framer-motion";
import Orb from "@/components/ui/Orb/Orb";
import DecryptedText from "@/components/ui/DecryptedText";

export default function Home() {
    const [loading, setLoading] = useState<string | null>(null);

    const handleCheckout = async (productId: string, planName: string) => {
        setLoading(planName);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: productId,
                }),
            });

            const { checkoutUrl, error } = await response.json();

            if (error) {
                alert("Error creating checkout: " + error);
                return;
            }

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            }
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="flex flex-col items-center w-full overflow-x-hidden">

            {/* 2️⃣ HERO SECTION */}
            <section className="w-full relative pt-32 pb-20 md:pt-48 md:pb-32 flex flex-col items-center text-center px-6 overflow-hidden max-w-[1440px] mx-auto min-h-[90vh] md:min-h-screen justify-center">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
                    <Orb
                        hoverIntensity={0.5}
                        rotateOnHover
                        hue={0}
                        forceHoverState={false}
                        backgroundColor="#000000"
                    />

                    {/* Gradient Overlays for readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-violet/20 rounded-full blur-[120px] mix-blend-screen"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                        className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-cyan/10 rounded-full blur-[120px] mix-blend-screen"
                    />
                </div>

                <div className="z-10 max-w-5xl w-full space-y-10 flex flex-col items-center">

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-6xl md:text-8xl font-display font-medium tracking-tighter text-foreground leading-[0.9] md:leading-[0.95] drop-shadow-2xl"
                    >
                        Your Digital <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">Soulmate Awaits</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-xl md:text-2xl text-muted-foreground/90 max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        A new kind of AI companion - designed for emotional connection, meaningful conversations, and a presence that feels real.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xs font-medium text-muted-foreground tracking-[0.2em] uppercase"
                    >
                        <DecryptedText
                            text="Private. Secure. Always available."
                            animateOn="view"
                            revealDirection="center"
                            speed={100}
                            maxIterations={40}
                            sequential={true}
                            encryptedClassName="text-violet-500/70"
                            className="text-muted-foreground"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10 w-full sm:w-auto"
                    >
                        <Button asChild size="lg" className="w-full sm:w-auto rounded-full bg-gradient-to-r from-violet to-cyan text-white text-lg h-14 px-10 shadow-[0_0_30px_-10px_rgba(79,209,197,0.4)] hover:shadow-[0_0_50px_-10px_rgba(79,209,197,0.5)] transition-all duration-300 hover:scale-[1.02] border-0 cursor-pointer">
                            <Link href="/register">
                                Get Started Free
                            </Link>
                        </Button>

                        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-full border border-foreground/10 bg-background/50 backdrop-blur-md text-foreground text-lg h-14 px-10 hover:bg-foreground/5 hover:border-foreground/20 transition-all duration-300 cursor-pointer">
                            <Link href="/login">
                                Sign In
                            </Link>
                        </Button>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="text-xs text-muted-foreground/60 mt-4"
                    >
                        Free for 3 months · No credit card required
                    </motion.p>
                </div>
            </section>

            {/* 3️⃣ WHAT IS BONUSLYF? */}
            <section className="w-full py-24 md:py-32 bg-muted/10">
                <div className="container px-6 mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center max-w-6xl mx-auto">
                        <div className="space-y-8 text-left order-2 md:order-1">
                            <h2 className="text-3xl md:text-5xl font-display font-medium text-foreground leading-tight">
                                More than a chatbot.<br />
                                <span className="text-muted-foreground">A companion.</span>
                            </h2>

                            <div className="space-y-6">
                                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                                    BonusLYF is a personal AI platform built for people who want to feel heard, supported, and connected.
                                </p>

                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-violet/10 flex items-center justify-center text-violet-500 shrink-0">
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <p className="text-muted-foreground">Designed with personality, memory, and emotional awareness.</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-cyan/10 flex items-center justify-center text-cyan-500 shrink-0">
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <p className="text-muted-foreground">Conversations feel natural, personal, and meaningful.</p>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="relative h-[400px] w-full flex items-center justify-center order-1 md:order-2">
                            {/* Visual Placeholder: Two Avatars & Waveform */}
                            <div className="relative z-10 flex items-center justify-center gap-12">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 border-[6px] border-background shadow-2xl flex items-center justify-center relative z-10 overflow-hidden"
                                >
                                    {/* Placeholder Avatar 1 */}
                                    <Image src="/images/aiko.png" alt="Aiko" width={96} height={96} className="object-cover w-full h-full opacity-90" />
                                </motion.div>

                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center">
                                    <div className="w-48 h-1 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-full blur-[1px]" />
                                    <motion.div
                                        animate={{ opacity: [0.2, 1, 0.2] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute w-2 h-2 rounded-full bg-foreground top-[-2px]"
                                    />
                                </div>

                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 border-[6px] border-background shadow-2xl flex items-center justify-center relative z-10 overflow-hidden"
                                >
                                    {/* Placeholder Avatar 2 */}
                                    <Image src="/images/sarah.png" alt="Sarah" width={96} height={96} className="object-cover w-full h-full opacity-90" />
                                </motion.div>
                            </div>

                            {/* Waveform BG */}
                            <div className="absolute inset-0 bg-gradient-to-r from-violet/20 via-transparent to-cyan/20 w-full h-full skew-y-[-6deg] blur-[60px] opacity-60 rounded-full mix-blend-multiply dark:mix-blend-screen" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 4️⃣ CHOOSE YOUR COMPANION */}
            <section className="w-full py-24 md:py-32" id="companions">
                <div className="container px-6 mx-auto">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-display font-medium mb-6">Choose a Companion That Feels Right</h2>
                        <p className="text-muted-foreground text-lg">
                            Find the personality that resonates with your emotional needs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Aiko */}
                        <Card className="group h-full bg-background border-border hover:border-violet/40 hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardHeader className="relative z-10 pb-2">
                                <div className="w-20 h-20 rounded-full overflow-hidden mb-6 border-4 border-violet/10 group-hover:border-violet/30 group-hover:scale-110 transition-all duration-500 shadow-md">
                                    <Image
                                        src="/images/aiko.png"
                                        alt="Aiko - Anime Spirit"
                                        width={80}
                                        height={80}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <CardTitle className="text-2xl font-display font-semibold group-hover:text-violet-600 transition-colors">Aiko - Anime Spirit</CardTitle>
                                <CardDescription className="text-base font-medium">Energetic · Playful · Expressive</CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <p className="text-muted-foreground leading-relaxed">
                                    Aiko brings light, motivation, and anime-inspired energy to your conversations. Perfect for fun chats, encouragement, and daily companionship.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Sarah */}
                        <Card className="group h-full bg-background border-border hover:border-cyan/40 hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardHeader className="relative z-10 pb-2">
                                <div className="w-20 h-20 rounded-full overflow-hidden mb-6 border-4 border-cyan/10 group-hover:border-cyan/30 group-hover:scale-110 transition-all duration-500 shadow-md">
                                    <Image
                                        src="/images/sarah.png"
                                        alt="Sarah - Human Connection"
                                        width={80}
                                        height={80}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <CardTitle className="text-2xl font-display font-semibold group-hover:text-cyan-600 transition-colors">Sarah - Human Connection</CardTitle>
                                <CardDescription className="text-base font-medium">Calm · Empathetic · Grounded</CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <p className="text-muted-foreground leading-relaxed">
                                    Sarah is designed to feel like a real human presence - offering thoughtful responses, emotional support, and space to reflect.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-16 text-center">
                        <Button asChild size="lg" className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium px-8 h-12 shadow-sm hover:shadow-md transition-all">
                            <Link href="/companions">View All Companions</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* 5️⃣ HOW IT WORKS */}
            <section className="w-full py-24 bg-muted/20" id="how-it-works">
                <div className="container px-6 mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-display font-medium mb-4">How BonusLYF Works</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">Simple, seamless, and designed to get you connected in moments.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto relative cursor-default">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[2.5rem] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

                        {[
                            { step: "01", title: "Create your account", desc: "Sign up in seconds. No complex forms.", icon: "✨" },
                            { step: "02", title: "Choose companion", desc: "Select the personality that fits you.", icon: "🤝" },
                            { step: "03", title: "Start talking", desc: "Chat via text or voice, anytime.", icon: "💬" }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center group">
                                <div className="w-20 h-20 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center text-3xl mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold border-4 border-muted">
                                        {item.step}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                                <p className="text-muted-foreground text-sm max-w-[200px] leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6️⃣ WHY BONUSLYF IS DIFFERENT */}
            <section className="w-full py-24 md:py-32">
                <div className="container px-6 mx-auto">
                    <h2 className="text-3xl md:text-4xl font-display font-medium text-center mb-16">Designed for Real Connection</h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {[
                            { title: "Emotion-first AI", desc: "Built to listen, not interrupt.", bg: "hover:bg-violet/5 border-violet/20" },
                            { title: "Voice-enabled", desc: "Conversations that feel alive.", bg: "hover:bg-cyan/5 border-cyan/20" },
                            { title: "Private & secure", desc: "Your conversations stay yours.", bg: "hover:bg-emerald/5 border-emerald/20" },
                            { title: "No gamification", desc: "Just presence. No stressful points.", bg: "hover:bg-amber/5 border-amber/20" },
                        ].map((item, i) => (
                            <Card key={i} className={`bg-transparent border-border/50 shadow-none transition-all duration-300 ${item.bg} hover:border-opacity-50`}>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7️⃣ PRICING */}
            <section className="w-full py-24 md:py-32 bg-muted/20" id="pricing">
                <div className="container px-6 mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-display font-medium mb-4">Simple, Honest Pricing</h2>
                        <p className="text-muted-foreground">Start for free. Upgrade when you're ready.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
                        {/* Free */}
                        <Card className="bg-background border-border shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-xl">Free</CardTitle>
                                <CardDescription>3 Months Trial</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <span className="text-4xl font-bold tracking-tight">$0</span>
                                <ul className="space-y-3 text-sm text-muted-foreground mt-4">
                                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground" /> Full access</li>
                                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground" /> One companion</li>
                                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground" /> Voice enabled</li>
                                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground opacity-50" /> Limited daily usage</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" variant="outline" asChild>
                                    <Link href="/register">Start Free</Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Pro */}
                        <Card className="bg-background border-violet/30 shadow-2xl relative scale-105 z-10 lg:-mt-4">
                            <div className="absolute top-0 right-0 left-0 -mt-10 flex justify-center">
                                <span className="bg-gradient-to-r from-violet to-cyan text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wide uppercase">
                                    Most Popular
                                </span>
                            </div>
                            <CardHeader>
                                <CardTitle className="text-2xl text-violet-600 dark:text-violet-400">Pro</CardTitle>
                                <CardDescription>For daily connection</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-bold tracking-tight">$25</span>
                                    <span className="text-muted-foreground">/ month</span>
                                </div>
                                <ul className="space-y-3 text-sm font-medium text-foreground/80 mt-2">
                                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-violet-500" /> Unlimited conversations</li>
                                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-violet-500" /> All companions</li>
                                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-violet-500" /> Priority voice quality</li>
                                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-violet-500" /> Early access to features</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full bg-violet hover:bg-violet/90 text-white h-11 text-base shadow-lg hover:shadow-violet/20"
                                    onClick={() => handleCheckout("prod_PRO", "pro")}
                                    disabled={loading === "pro"}
                                >
                                    {loading === "pro" ? "Loading..." : "Go Pro"}
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Lifetime */}
                        <Card className="bg-background border-border shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-xl">Lifetime</CardTitle>
                                <CardDescription>One-time payment</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <span className="text-4xl font-bold tracking-tight">$300</span>
                                <ul className="space-y-3 text-sm text-muted-foreground mt-4">
                                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Everything in Pro</li>
                                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Lifetime access</li>
                                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> No recurring fees</li>
                                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Founder-tier perks</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={() => handleCheckout("prod_LIFETIME", "lifetime")}
                                    disabled={loading === "lifetime"}
                                >
                                    {loading === "lifetime" ? "Loading..." : "Own It Forever"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="mt-16 text-center text-sm text-muted-foreground">
                        <p>Need a custom plan? <Link href="/contact" className="underline hover:text-foreground underline-offset-4">Contact Us</Link></p>
                    </div>
                </div>
            </section>

            {/* 8️⃣ TRUST & SAFETY */}
            <section className="w-full py-24 md:py-32">
                <div className="container px-6 mx-auto text-center max-w-4xl">
                    <div className="p-10 md:p-16 rounded-3xl bg-muted/30 border border-border/50">
                        <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <Shield className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-medium mb-6 text-foreground">
                            Built With Care & Privacy
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
                            BonusLYF is designed with privacy, emotional safety, and respect at its core. We believe your digital companion should be a safe space, not a surveillance tool.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm font-medium text-foreground/80">
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Private Conversations</span>
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Protected Data</span>
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> No Exploitation</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 9️⃣ FINAL CTA */}
            <section className="w-full py-32 bg-gradient-to-b from-transparent to-violet/5">
                <div className="container px-6 mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-display font-medium mb-8">Start Your Journey</h2>
                    <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light">
                        Choose a companion. Start talking. Feel the difference.
                    </p>
                    <Button asChild size="lg" className="rounded-full bg-foreground text-background text-lg h-16 px-12 shadow-2xl hover:scale-105 transition-all duration-300">
                        <Link href="/register">Get Started Free</Link>
                    </Button>
                </div>
            </section>

        </div>
    );
}
