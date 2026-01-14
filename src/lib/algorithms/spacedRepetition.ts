export interface CardReviewData {
  cardId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  lastReviewedAt: string | null;
  nextReviewAt: string | null;
}

export function calculateNextReview(
  currentData: CardReviewData,
  quality: number
): CardReviewData {
  const { easeFactor, interval, repetitions } = currentData;

  let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEaseFactor = Math.max(1.3, newEaseFactor);

  let newInterval = interval;
  let newRepetitions = repetitions;

  if (quality >= 3) {
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEaseFactor);
    }
    newRepetitions = repetitions + 1;
  } else {
    newRepetitions = 0;
    newInterval = 1;
  }

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + newInterval);

  return {
    ...currentData,
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    lastReviewedAt: new Date().toISOString(),
    nextReviewAt: nextReviewAt.toISOString(),
  };
}

export function isDue(reviewData: CardReviewData): boolean {
  if (!reviewData.nextReviewAt) return true;
  return new Date(reviewData.nextReviewAt) <= new Date();
}

export function getDefaultReviewData(cardId: string): CardReviewData {
  return {
    cardId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    lastReviewedAt: null,
    nextReviewAt: null,
  };
}
