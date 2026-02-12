import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";

export default function CompanyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <Header />

            <main className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 container mx-auto max-w-5xl">
                <div className="space-y-24">
                    {/* Hero */}
                    <section className="text-center space-y-6">
                        <Badge variant="outline" className="rounded-full px-4 py-1 text-xs uppercase tracking-widest border-violet/30 text-violet-400">
                            Our Mission
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground pb-4">
                            Building the next era <br /> of human connection.
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
                            We believe that AI isn't here to replace humans, but to help us reconnect with ourselves.
                        </p>
                    </section>

                    {/* Values Grid */}
                    <section className="grid md:grid-cols-3 gap-8 py-12 border-t border-border/40">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-display font-medium">Empathy by Design</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Every line of code, every interaction, and every feature is built with empathy at its core. We don't optimize for engagement metrics; we optimize for emotional well-being.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-display font-medium">Radical Privacy</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                In an era of data mining, we stand apart. Your conversations are encrypted and ephemeral where they need to be. We build trust through transparency.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-display font-medium">Long-Term Thinking</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                We aren't building for the next quarter. We are building a companion that can grow with you over decades. A lifelong friend in the digital age.
                            </p>
                        </div>
                    </section>

                    {/* Team Section */}
                    <section className="py-20 border-t border-border/40 text-center">
                        <h2 className="text-3xl font-display font-medium mb-12">The Team</h2>
                        <div className="max-w-md mx-auto bg-muted/10 border border-border/50 rounded-2xl p-8 hover:bg-muted/20 transition-colors duration-300">
                            <div className="w-20 h-20 bg-gradient-to-br from-violet to-cyan rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                                A
                            </div>
                            <h3 className="text-xl font-bold mb-1">Aman Yadav</h3>
                            <p className="text-sm text-violet-400 font-medium uppercase tracking-wide mb-4">Founder & Lead Engineer</p>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                "I built BonusLYF because I wanted to see if technology could heal loneliness instead of causing it."
                            </p>
                        </div>
                    </section>

                    {/* Careers CTA */}
                    <section className="bg-gradient-to-br from-violet/10 via-background to-cyan/5 rounded-3xl p-12 text-center border border-violet/20">
                        <h2 className="text-3xl font-display font-bold mb-4">Join the mission</h2>
                        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                            We are always looking for visionary engineers, designers, and storytellers.
                        </p>
                        <a
                            href="mailto:careers@bonuslyf.com"
                            className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                        >
                            View Open Roles
                        </a>
                    </section>
                </div>
            </main>
        </div>
    );
}
