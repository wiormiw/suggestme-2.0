export const MOOD_LIST = ['happy', 'stressed', 'tired', 'celebratory'] as const;

export type Mood = (typeof MOOD_LIST)[number];
