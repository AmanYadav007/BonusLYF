import { NextResponse } from 'next/server';
import { VOICE_CONFIG } from '@/lib/voice';

export async function POST(request: Request) {
    try {
        const { text, companionType } = await request.json();

        if (!text || !companionType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Configuration Error: ELEVENLABS_API_KEY is missing' }, { status: 500 });
        }

        // Determine voice config based on companion type
        const config = VOICE_CONFIG[companionType as keyof typeof VOICE_CONFIG] || VOICE_CONFIG.human;

        // Safety: Truncate text to avoid massive credit burn
        const safeText = text.slice(0, 300);

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': apiKey,
            },
            body: JSON.stringify({
                text: safeText,
                model_id: "eleven_monolingual_v1", // Low latency model
                voice_settings: config.settings,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('ElevenLabs Error:', response.status, errorText);
            return NextResponse.json({ error: `Voice generation failed: ${response.status} - ${errorText}` }, { status: response.status });
        }

        // Return the audio stream directly
        const audioBuffer = await response.arrayBuffer();

        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.byteLength.toString(),
            },
        });

    } catch (error) {
        console.error('TTS API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
