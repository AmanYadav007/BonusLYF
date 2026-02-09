'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
        return { error: 'Missing fields' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'BonusLYF Contact <onboarding@resend.dev>', // Default testing sender, change if domain verified
            to: ['aman.yadav@bonuslyf.com'],
            replyTo: email,
            subject: `New Contact Form Submission from ${name}`,
            text: `
Name: ${name}
Email: ${email}
Message:
${message}
            `,
            // Optional: HTML version
            html: `
<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong></p>
<p style="white-space: pre-wrap;">${message}</p>
            `
        });

        if (error) {
            console.error('Resend error:', error);
            return { error: error.message };
        }

        return { success: true };
    } catch (err: any) {
        console.error('Email send error:', err);
        return { error: err.message };
    }
}
