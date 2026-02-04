import { NextResponse } from 'next/server';
import { generateResponse } from '@/lib/llm';

export async function POST(request: Request) {
    try {
        const { message, companionType, history } = await request.json();

        if (!message || !companionType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Call the LLM (XAI)
        // Note: We are passing just the message text for now as the 'history' handling
        // depends on how llm.ts is structured. llm.ts expects (message, type, history).
        const aiResponse = await generateResponse(message, companionType, history || []);

        return NextResponse.json({ response: aiResponse });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
