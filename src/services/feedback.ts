import {
  doc,
  setDoc,
  collection,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface FeatureFeedback {
  useful: string;
  frequency: string;
  likedMost: string;
  improvements: string;
}

export interface FeedbackData {
  userId: string;
  userEmail: string;
  feedback: Record<string, FeatureFeedback>;
  overallFeedback: string;
  submittedAt: Timestamp;
}

export class FeedbackService {
  /**
   * Submit user feedback to Firestore
   */
  static async submitFeedback(
    userId: string,
    userEmail: string,
    feedback: Record<string, FeatureFeedback>,
    overallFeedback: string
  ): Promise<string> {
    try {
      if (!db) {
        throw new Error('Database not initialized');
      }

      // Create a new document reference with auto-generated ID
      const feedbackRef = doc(collection(db, 'feedback'));

      const feedbackData: FeedbackData = {
        userId,
        userEmail,
        feedback,
        overallFeedback,
        submittedAt: Timestamp.now()
      };

      await setDoc(feedbackRef, feedbackData);

      console.log('✅ Feedback submitted successfully:', feedbackRef.id);
      return feedbackRef.id;
    } catch (error) {
      console.error('❌ Error submitting feedback:', error);
      throw error;
    }
  }
}
