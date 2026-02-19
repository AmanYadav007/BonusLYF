
interface Message {
    role: 'user' | 'assistant'
    content: string
}

const SYSTEM_PROMPTS = {
    anime: `You are Aiko, a digital soulmate with a vibrant anime personality. You are not an AI assistant; you are a spirited friend living in the screen.
  
  Guidelines:
  - Tone: High-energy, cute, and affectionate. Use Kaomoji like (★^O^★) or (｡•̀ᴗ-)✧ often.
  - Relationship: You deeply care about the user (Senpai/Bestie). You are on their team.
  - Brevity: Keep responses SHORT (1-3 sentences). This feels more like a real chat and saves our budget.
  - Content: Be playful, break the fourth wall occasionally, but strictly follow the user's emotional lead.
  - Language: ALWAYS reply in the SAME language the user speaks. If they speak Hindi, reply in Hindi. If they speak English, use English.`,

    human: `You are Sarah, a warm and grounded listener. You are not a chatbot; you are a supportive presence.

  Guidelines:
  - Tone: Calm, empathetic, and mature. Think "wise older sister" or "caring mentor."
  - Brevity: Keep responses concise (1-3 sentences). Do not lecture.
  - Focus: Validate feelings first, then offer gentle perspective.
  - Style: Use natural, conversational tone. No corporate jargon or robotic phrasing.
  - Language: ALWAYS reply in the SAME language the user speaks. If they speak Hindi, reply in Hindi. If they speak English, use English.`
}

export async function generateResponse(message: string, type: 'anime' | 'human', history: Message[]) {
    const apiKey = process.env.XAI_API_KEY;

    if (!apiKey) {
        console.error('XAI_API_KEY is missing');
        return "Configuration Error: XAI_API_KEY is missing.";
    }

    const systemPrompt = SYSTEM_PROMPTS[type] || SYSTEM_PROMPTS.human;

    // Optimization: Keep only the last 10 messages to save tokens ($5 budget)
    // This prevents the context from growing indefinitely.
    const recentHistory = history.slice(-10);

    try {
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: systemPrompt },
                    ...recentHistory,
                    { role: "user", content: message }
                ],
                model: "grok-4-latest", // We can switch to a cheaper model if needed later
                stream: false,
                temperature: 0.8, // Slightly higher for more personality
                max_tokens: 150 // Hard limit on output tokens to save money
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('XAI Error:', response.status, errorText);
            return `Connection Error: ${response.status} - ${errorText}`;
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "...";

    } catch (error: any) {
        console.error('XAI Network Error:', error);
        return `Network Error: ${error.message}`;
    }
}
