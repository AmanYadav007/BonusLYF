export type CompanionType = 'anime' | 'human';

export interface Companion {
    id: string;
    type: CompanionType;
    name: string;
    description: string;
    avatar_url: string;
    system_prompt: string;
}

export const COMPANIONS: Companion[] = [
    {
        id: 'comp_anime_01',
        type: 'anime',
        name: 'Aiko',
        description: 'Your energetic and cheerful anime spirited friend.',
        avatar_url: '/anime.png', // Placeholder
        system_prompt: 'You are Aiko, a cheerful anime character.'
    },
    {
        id: 'comp_human_01',
        type: 'human',
        name: 'Sarah',
        description: 'A calm, empathetic, and realistic listener.',
        avatar_url: '/human.png', // Placeholder
        system_prompt: 'You are Sarah, a life coach and empathetic listener.'
    }
];
