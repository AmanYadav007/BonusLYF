import { Header } from "@/components/layout/header";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-violet/20">
            <Header />

            <main className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 container mx-auto max-w-4xl">
                <div className="space-y-12">
                    <div className="space-y-4 text-center">
                        <h1 className="text-4xl md:text-6xl font-display font-medium tracking-tight">
                            Products under <span className="text-muted-foreground">BonusLYF</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                            Everything we build, designed to keep you connected.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 py-12 border-t border-border/40">
                        <Card className="bg-muted/10 border-border/50 hover:bg-muted/20 transition-colors duration-300">
                            <CardHeader>
                                <CardTitle className="text-xl font-display font-medium">QuickSideTool</CardTitle>
                                <CardDescription>
                                    Free PDF tools, image editor, and QR generator. A fast alternative to heavy desktop apps.
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="gap-3 flex-wrap">
                                <Button asChild className="rounded-full bg-gradient-to-r from-violet to-cyan text-white font-medium px-6 hover:shadow-[0_0_20px_-5px_rgba(79,209,197,0.5)] hover:scale-105 transition-all duration-300 border-0">
                                    <a href="https://quick-side-tool.vercel.app/" target="_blank" rel="noopener noreferrer">
                                        Open Tool
                                    </a>
                                </Button>
                                <Button asChild variant="outline" className="rounded-full font-medium px-6">
                                    <a href="https://chromewebstore.google.com/detail/quick-side-tool/ednlokciemgblchidkhbhhndphgjkoip" target="_blank" rel="noopener noreferrer">
                                        Chrome Extension
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                        <Card className="bg-muted/10 border-border/50 hover:bg-muted/20 transition-colors duration-300">
                            <CardHeader>
                                <CardTitle className="text-xl font-display font-medium">Image Resizer</CardTitle>
                                <CardDescription>
                                    Easily resize, optimize, and convert images right from your browser. Fast, free, and private — all processing happens locally.
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="gap-3 flex-wrap">
                                <Button asChild variant="outline" className="rounded-full font-medium px-6">
                                    <a href="https://chromewebstore.google.com/detail/image-resizer-resize-opti/bmooadknflpjeaagpaaclbcgdpgglagn" target="_blank" rel="noopener noreferrer">
                                        Chrome Extension
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}