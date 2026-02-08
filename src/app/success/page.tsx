import { Suspense } from 'react';
import { CheckCircle2 } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

function SuccessContent({ searchParams }: { searchParams: { checkout_id?: string } }) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center bg-background">
            <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                </div>

                <h1 className="text-4xl font-display font-bold text-foreground">
                    Payment Successful!
                </h1>

                <p className="text-lg text-muted-foreground">
                    Thank you for your purchase. You should receive a confirmation email shortly.
                </p>

                {searchParams.checkout_id && (
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                        <p className="text-xs text-muted-foreground break-all">
                            Order ID: {searchParams.checkout_id}
                        </p>
                    </div>
                )}

                <div className="pt-4">
                    <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-violet to-cyan text-white shadow-lg w-full sm:w-auto">
                        <Link href="/dashboard">
                            Go to Dashboard
                        </Link>
                    </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-foreground underline">Back to Home</Link>
                </div>
            </div>
        </main>
    );
}

// ... imports remain same

export default async function SuccessPage({
    searchParams
}: {
    searchParams: Promise<{ checkout_id?: string }>
}) {
    const resolvedParams = await searchParams;

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SuccessContent searchParams={resolvedParams} />
        </Suspense>
    );
}
