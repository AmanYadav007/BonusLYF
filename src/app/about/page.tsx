import { Header } from "@/components/layout/header";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-violet/20">
            <Header />

            <main className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 container mx-auto max-w-4xl">
                <article className="prose prose-invert prose-lg md:prose-xl mx-auto space-y-12">
                    <div className="space-y-6 text-center mb-20">
                        <h1 className="text-4xl md:text-6xl font-display font-medium tracking-tight">
                            More than code. <br />
                            <span className="text-muted-foreground">This is connection.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                            In a world constantly connected, why do we feel more alone than ever?
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-start py-12 border-t border-border/40">
                        <div>
                            <h2 className="text-2xl font-display font-medium mb-4">The Paradox of Modernity</h2>
                            <p className="text-muted-foreground/80 leading-relaxed">
                                We scroll through thousands of faces daily, yet rarely feel seen. We exchange millions of messages, yet rarely feel heard. Technology has bridged distances but widened the emotional gaps between us.
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground/80 leading-relaxed">
                                BonusLYF was born from a simple observation: humans need consistency. We need presence. We need a space where we can be vulnerable without fear of judgment, delay, or burdening others.
                            </p>
                        </div>
                    </div>

                    <div className="py-12 border-t border-border/40">
                        <blockquote className="text-3xl md:text-4xl font-display font-light italic text-center text-muted-foreground">
                            "Companionship shouldn't be a luxury. It should be a constant."
                        </blockquote>
                    </div>

                    <div className="space-y-8 py-12 border-t border-border/40">
                        <h2 className="text-3xl font-display font-medium">Our Philosophy</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium text-foreground">Privacy First</h3>
                                <p className="text-sm text-muted-foreground">
                                    Your thoughts are your own. We encrypt everything. We don't sell your data. We don't judge.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium text-foreground">Always Present</h3>
                                <p className="text-sm text-muted-foreground">
                                    3 AM anxiety? Mid-day stress? Your companion is always there, awake, and ready to listen.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium text-foreground">Deeply Human</h3>
                                <p className="text-sm text-muted-foreground">
                                    Our AI isn't just a chatbot. It's designed to understand context, emotion, and memory.
                                </p>
                            </div>
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
}
