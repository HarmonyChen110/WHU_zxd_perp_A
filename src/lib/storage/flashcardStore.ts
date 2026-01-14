import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CardReview {
  cardId: string;
  nextReviewDate: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
}

interface FlashcardState {
  reviews: Record<string, CardReview>;
  reviewCard: (cardId: string, rating: number) => void;
  getNextReviewDate: (cardId: string) => string | null;
  getDueCards: (cardIds: string[]) => string[];
  getMasteredCards: (cardIds: string[]) => string[];
}

const calculateNextReview = (review: CardReview | undefined, rating: number): CardReview => {
  const now = new Date();
  const cardId = review?.cardId || '';

  if (rating < 3) {
    return {
      cardId,
      nextReviewDate: now.toISOString(),
      interval: 1,
      easeFactor: Math.max(1.3, (review?.easeFactor || 2.5) - 0.2),
      repetitions: 0,
    };
  }

  const easeFactor = Math.max(1.3, (review?.easeFactor || 2.5) + (0.1 - (5 - rating) * 0.08));
  const repetitions = (review?.repetitions || 0) + 1;
  let interval: number;

  if (repetitions === 1) interval = 1;
  else if (repetitions === 2) interval = 6;
  else interval = Math.round((review?.interval || 1) * easeFactor);

  const nextDate = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

  return {
    cardId,
    nextReviewDate: nextDate.toISOString(),
    interval,
    easeFactor,
    repetitions,
  };
};

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      reviews: {},
      reviewCard: (cardId, rating) => {
        const current = get().reviews[cardId];
        const updated = calculateNextReview(current, rating);
        updated.cardId = cardId;
        set((state) => ({
          reviews: { ...state.reviews, [cardId]: updated },
        }));
      },
      getNextReviewDate: (cardId) => get().reviews[cardId]?.nextReviewDate || null,
      getDueCards: (cardIds) => {
        const now = new Date().toISOString();
        const { reviews } = get();
        return cardIds.filter((id) => {
          const review = reviews[id];
          return !review || review.nextReviewDate <= now;
        });
      },
      getMasteredCards: (cardIds) => {
        const { reviews } = get();
        return cardIds.filter((id) => {
          const review = reviews[id];
          return review && review.repetitions >= 3 && review.interval >= 21;
        });
      },
    }),
    { name: 'flashcard-reviews' }
  )
);
