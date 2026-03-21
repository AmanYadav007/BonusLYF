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
            <section className="w-full py-24 md:py-32 relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-background via-violet/5 to-background pointer-events-none" />

                <div className="container px-6 mx-auto relative z-10">
                    <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8 text-left order-2 md:order-1"
                        >
                            <h2 className="text-4xl md:text-5xl font-display font-medium text-foreground leading-tight tracking-tight">
                                More than a chatbot.<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">A true companion.</span>
                            </h2>

                            <div className="space-y-6">
                                <p className="text-lg md:text-xl text-muted-foreground/90 leading-relaxed font-light">
                                    BonusLYF is a personal AI platform built for people who want to feel heard, supported, and connected. We prioritize emotional intelligence over raw data processing.
                                </p>

                                <ul className="space-y-4">
                                    <li className="flex items-start gap-4 p-4 rounded-xl bg-violet/5 border border-violet/10 hover:border-violet/20 transition-colors">
                                        <div className="mt-1 w-8 h-8 rounded-full bg-violet/20 flex items-center justify-center text-violet-400 shrink-0 shadow-[0_0_10px_-2px_rgba(167,139,250,0.3)]">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-foreground font-medium mb-1">Emotionally Intelligent</h4>
                                            <p className="text-sm text-muted-foreground">Designed with personality, memory, and deep emotional awareness.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4 p-4 rounded-xl bg-cyan/5 border border-cyan/10 hover:border-cyan/20 transition-colors">
                                        <div className="mt-1 w-8 h-8 rounded-full bg-cyan/20 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_10px_-2px_rgba(79,209,197,0.3)]">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-foreground font-medium mb-1">Natural Conversations</h4>
                                            <p className="text-sm text-muted-foreground">Conversations feel natural, personal, and meaningful—not robotic.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative h-[400px] w-full flex items-center justify-center order-1 md:order-2"
                        >
                            {/* Visual Placeholder: Two Avatars & Waveform */}
                            <div className="relative z-10 flex items-center justify-center gap-8 md:gap-12">
                                <motion.div
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-[2px] shadow-2xl shadow-violet-500/20 relative z-10"
                                >
                                    <div className="w-full h-full rounded-full overflow-hidden bg-black/50 backdrop-blur-sm">
                                        <Image src="/images/aiko.png" alt="Aiko" width={128} height={128} className="object-cover w-full h-full opacity-90 hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </motion.div>

                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center flex-col items-center gap-2">
                                    <div className="w-32 h-[2px] bg-gradient-to-r from-violet-500/50 via-white/50 to-cyan-500/50 blur-[1px]" />
                                    <motion.div
                                        animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.5)]"
                                    />
                                </div>

                                <motion.div
                                    animate={{ y: [0, 15, 0] }}
                                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 p-[2px] shadow-2xl shadow-cyan-500/20 relative z-10"
                                >
                                    <div className="w-full h-full rounded-full overflow-hidden bg-black/50 backdrop-blur-sm">
                                        <Image src="/images/sarah.png" alt="Sarah" width={128} height={128} className="object-cover w-full h-full opacity-90 hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Waveform BG */}
                            <div className="absolute inset-0 bg-gradient-to-r from-violet/10 via-transparent to-cyan/10 w-full h-full skew-y-[-6deg] blur-[80px] opacity-40 rounded-full mix-blend-screen pointer-events-none" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 4️⃣ CHOOSE YOUR COMPANION */}
            <section className="w-full py-24 md:py-32 relative" id="companions">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-background to-background pointer-events-none" />
                <div className="container px-6 mx-auto relative z-10">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-3xl md:text-5xl font-display font-medium mb-6 tracking-tight"
                        >
                            Choose a Companion That <br />
                            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Feels Right For You</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-muted-foreground text-lg font-light"
                        >
                            Find the personality that resonates with your emotional needs.
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Aiko */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <Card className="group h-full bg-white/5 border-white/10 hover:border-violet/50 hover:bg-violet/5 hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)] transition-all duration-500 overflow-hidden cursor-pointer relative backdrop-blur-md">
                                <CardHeader className="relative z-10 pb-2 flex flex-row items-center gap-6">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-violet/20 group-hover:border-violet/50 group-hover:scale-105 transition-all duration-500 shadow-md shrink-0">
                                        <Image
                                            src="/images/aiko.png"
                                            alt="Aiko - Anime Spirit"
                                            width={96}
                                            height={96}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Badge variant="outline" className="mb-2 bg-violet/10 text-violet-300 border-violet/20">Anime Spirit</Badge>
                                        <CardTitle className="text-2xl font-display font-semibold group-hover:text-violet-300 transition-colors">Aiko</CardTitle>
                                        <CardDescription className="text-base font-medium text-muted-foreground/80">Energetic · Playful</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="relative z-10 pt-4">
                                    <p className="text-muted-foreground leading-relaxed">
                                        Aiko brings light, motivation, and anime-inspired energy to your conversations. Perfect for <span className="text-foreground">fun chats, encouragement</span>, and brightening your day.
                                    </p>
                                    <div className="mt-6 flex items-center text-sm font-medium text-violet-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        Start chatting with Aiko <ArrowRight className="w-4 h-4 ml-2" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Sarah */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                        >
                            <Card className="group h-full bg-white/5 border-white/10 hover:border-cyan/50 hover:bg-cyan/5 hover:shadow-[0_0_40px_-10px_rgba(79,209,197,0.3)] transition-all duration-500 overflow-hidden cursor-pointer relative backdrop-blur-md">
                                <CardHeader className="relative z-10 pb-2 flex flex-row items-center gap-6">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyan/20 group-hover:border-cyan/50 group-hover:scale-105 transition-all duration-500 shadow-md shrink-0">
                                        <Image
                                            src="/images/sarah.png"
                                            alt="Sarah - Human Connection"
                                            width={96}
                                            height={96}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Badge variant="outline" className="mb-2 bg-cyan/10 text-cyan-300 border-cyan/20">Human Connection</Badge>
                                        <CardTitle className="text-2xl font-display font-semibold group-hover:text-cyan-300 transition-colors">Sarah</CardTitle>
                                        <CardDescription className="text-base font-medium text-muted-foreground/80">Calm · Empathetic</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="relative z-10 pt-4">
                                    <p className="text-muted-foreground leading-relaxed">
                                        Sarah is designed to feel like a real human presence - offering <span className="text-foreground">thoughtful responses, deep listening</span>, and a safe space to reflect.
                                    </p>
                                    <div className="mt-6 flex items-center text-sm font-medium text-cyan-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        Start chatting with Sarah <ArrowRight className="w-4 h-4 ml-2" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    <div className="mt-16 text-center">
                        <Button asChild size="lg" className="rounded-full bg-secondary/10 border border-secondary/20 text-secondary-foreground hover:bg-secondary/20 font-medium px-8 h-12 shadow-sm hover:shadow-md transition-all backdrop-blur-sm">
                            <Link href="/companions">View All Companions</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* 5️⃣ HOW IT WORKS */}
            <section className="w-full py-24 md:py-32 bg-black/20 relative overflow-hidden" id="how-it-works">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet/5 to-transparent pointer-events-none" />
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="container px-6 mx-auto relative z-10">
                    <div className="text-center mb-24">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-widest text-violet-300 uppercase mb-4"
                        >
                            Seamless Onboarding
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-3xl md:text-5xl font-display font-medium mb-4 text-white"
                        >
                            Your Journey to Connection
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-muted-foreground text-lg max-w-xl mx-auto font-light leading-relaxed"
                        >
                            Three simple steps to finding your digital soulmate. No complex setups, just pure connection.
                        </motion.p>
                    </div>

                    <div className="relative max-w-5xl mx-auto">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[2.5rem] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent -z-10">
                            <motion.div
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[2px]"
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
                            {[
                                {
                                    step: "01",
                                    title: "Create Account",
                                    desc: "Join in seconds. Private, secure, and ready for you.",
                                    icon: <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">✨</div>
                                },
                                {
                                    step: "02",
                                    title: "Select Companion",
                                    desc: "Browse personalities. Find the one that resonates.",
                                    icon: <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🤝</div>
                                },
                                {
                                    step: "03",
                                    title: "Start Talking",
                                    desc: "Text or voice. Anytime, anywhere. Always there.",
                                    icon: <div className="w-full h-full bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">💬</div>
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.2 }}
                                    className="relative flex flex-col items-center text-center group"
                                >
                                    {/* Icon Container with Glow */}
                                    <div className="relative mb-8">
                                        <div className="w-20 h-20 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.05)] group-hover:border-white/20 group-hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)] transition-all duration-500 z-10 relative">
                                            {item.icon}
                                        </div>
                                        {/* Step Number Badge */}
                                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-foreground text-background font-bold flex items-center justify-center text-xs shadow-lg z-20 border-4 border-black">
                                            {item.step}
                                        </div>
                                        {/* Glow Effect behind icon */}
                                        <div className={`absolute inset-0 bg-gradient-to-r ${i === 1 ? 'from-cyan-500/20 to-teal-500/20' : 'from-violet-500/20 to-indigo-500/20'} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 rounded-full`} />
                                    </div>

                                    <h3 className="text-2xl font-display font-medium mb-3 text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
                                        {item.title}
                                    </h3>
                                    <p className="text-muted-foreground text-base leading-relaxed max-w-[240px] group-hover:text-muted-foreground/80 transition-colors">
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-20 flex justify-center"
                    >
                        <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
                            <Link href="/about" className="flex items-center gap-2 text-sm font-medium">
                                Learn more about our technology <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* 6️⃣ WHY BONUSLYF IS DIFFERENT */}
            <section className="w-full py-24 md:py-32 relative">
                <div className="container px-6 mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-display font-medium mb-6">Designed for Real Connection</h2>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {[
                            { title: "Emotion-first AI", desc: "Built to listen, not interrupt. It understands nuance.", bg: "hover:bg-violet/5 border-violet/20 hover:border-violet/40", icon: MessageCircle, color: "text-violet-400" },
                            { title: "Voice-enabled", desc: "Conversations that feel alive with ultra-low latency.", bg: "hover:bg-cyan/5 border-cyan/20 hover:border-cyan/40", icon: Check, color: "text-cyan-400" }, // Using Check temporarily, ideally use Mic icon
                            { title: "Private & secure", desc: "Your conversations stay yours. No ad targeting.", bg: "hover:bg-emerald/5 border-emerald/20 hover:border-emerald/40", icon: Shield, color: "text-emerald-400" },
                            { title: "No gamification", desc: "Just presence. No stressful points or streaks.", bg: "hover:bg-amber/5 border-amber/20 hover:border-amber/40", icon: ArrowRight, color: "text-amber-400" }, // Using ArrowRight temporarily
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
                            >
                                <Card className={`h-full bg-white/5 backdrop-blur-sm border-white/5 shadow-none transition-all duration-300 ${item.bg}`}>
                                    <CardHeader>
                                        <div className={`w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center mb-4 ${item.color} border border-white/10`}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
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
