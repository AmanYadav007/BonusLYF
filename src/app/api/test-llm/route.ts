import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
    const apiKey = process.env.XAI_API_KEY;

    if (!apiKey || apiKey === 'your_key_here') {
        return NextResponse.json(
            { error: 'API Key not configured. Please add XAI_API_KEY to .env.local' },
            { status: 500 }
        );
    }

    const client = new OpenAI({
        apiKey: apiKey,
        baseURL: 'https://api.x.ai/v1',
    });

    try {
        const completion = await client.chat.completions.create({
            model: 'grok-4-1-fast-reasoning',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Hello! Are you working?' },
            ],
        });

        return NextResponse.json({
            success: true,
            message: completion.choices[0].message.content,
            model: completion.model
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
