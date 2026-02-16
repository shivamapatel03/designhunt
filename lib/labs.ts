export const LAB_REGISTRY: Record<string, string> = {
    // Mapping Lesson IDs to Lab IDs
    'lesson-2': 'button-feedback',
    'lesson-5': 'button-feedback', // Just for testing multiple
};

export function getLabForLesson(lessonId: string): string | undefined {
    return LAB_REGISTRY[lessonId];
}
