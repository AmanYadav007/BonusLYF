import { Header } from "@/components/layout/header";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <Header />
            <main className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 container mx-auto max-w-3xl prose prose-muted prose-headings:font-display prose-headings:font-medium prose-a:text-violet-500 hover:prose-a:text-violet-400">
                <h1>Privacy Policy</h1>
                <p className="lead">Last updated: February 9, 2026</p>

                <h2>1. Our Core Promise</h2>
                <p>We built BonusLYF because we believe in a private space for thoughts. We collect only what is necessary to provide the service, and we prioritize encryption and user control.</p>

                <h2>2. Information We Collect</h2>
                <p>We may collect:</p>
                <ul>
                    <li><strong>Account Basics:</strong> Email address for login and authentication.</li>
                    <li><strong>Chat History:</strong> Message content is stored securely to maintain context for your AI companion.</li>
                    <li><strong>Usage Data:</strong> Anonymous metrics on app performance and engagement (e.g., active time).</li>
                </ul>

                <h2>3. How We Use Your Data</h2>
                <p>We use your data solely to:</p>
                <ul>
                    <li>Provide and maintain the AI companion service.</li>
                    <li>Improve the quality and responsiveness of the AI.</li>
                    <li>Process payments (via secure third-party processor Creem).</li>
                </ul>
                <p><strong>We do NOT sell your personal data or conversation history to advertisers or third parties.</strong></p>

                <h2>4. Data Encryption</h2>
                <p>All communication between your device and our servers is encrypted using industry-standard TLS/SSL. Your chat history is stored in secure databases with access controls.</p>

                <h2>5. AI Training</h2>
                <p>We do not use your private conversations to train public foundation models without your explicit consent.</p>

                <h2>6. Your Rights</h2>
                <p>You have the right to request access to, correction of, or deletion of your personal data. You can delete your account and all associated data at any time from your dashboard settings.</p>

                <h2>7. Cookies</h2>
                <p>We use essential cookies to maintain your login session. We do not use third-party tracking cookies for advertising.</p>

                <h2>8. Contact Us</h2>
                <p>For privacy-related questions, please email <a href="mailto:privacy@bonuslyf.com">privacy@bonuslyf.com</a>.</p>
            </main>
        </div>
    );
}
