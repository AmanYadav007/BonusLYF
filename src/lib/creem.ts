import { createCreem } from 'creem_io';

export const creem = createCreem({
    apiKey: process.env.CREEM_API_KEY!,
    testMode: false, // Production mode enabled
});
