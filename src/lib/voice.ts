export const VOICE_CONFIG = {
    // Sarah: Energetic but calm, professional
    human: {
        voiceId: "21m00Tcm4TlvDq8ikWAM", // Default: Rachel (Replace with your preferred voice ID)
        settings: {
            stability: 0.75,
            similarity_boost: 0.6,
            style: 0.4,
            use_speaker_boost: true,
        }
    },
    // Aiko: Playful, faster, anime-vibes
    anime: {
        voiceId: "MF3mGyEYCl7XYWbV9V6O", // Default: Elli (Youthful, clear) (Replace with your preferred voice ID)
        settings: {
            stability: 0.45,
            similarity_boost: 0.8,
            style: 0.7,
            use_speaker_boost: true,
        }
    },
};
