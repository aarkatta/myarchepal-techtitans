import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
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
  id?: string;
  userId: string;
  userEmail: string;
  userName?: string;
  userDisplayName?: string;
  userInstitution?: string;
  userCredentials?: string;
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
    userName: string,
    userDisplayName: string,
    userInstitution: string,
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
        userName,
        userDisplayName: userDisplayName || userName,
        userInstitution: userInstitution || undefined,
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

  /**
   * Get all feedback with user profile data from archaeologists collection
   */
  static async getAllFeedback(): Promise<FeedbackData[]> {
    try {
      if (!db) {
        throw new Error('Database not initialized');
      }

      const feedbackRef = collection(db, 'feedback');
      const q = query(feedbackRef, orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const feedbackList: FeedbackData[] = [];
      querySnapshot.forEach((docSnap) => {
        feedbackList.push({
          id: docSnap.id,
          ...docSnap.data()
        } as FeedbackData);
      });

      // Fetch user profiles from archaeologists collection using userId
      const enrichedFeedback = await Promise.all(
        feedbackList.map(async (feedback) => {
          if (feedback.userId) {
            try {
              const archaeologistDoc = doc(db, 'archaeologists', feedback.userId);
              const archaeologistSnap = await getDoc(archaeologistDoc);

              if (archaeologistSnap.exists()) {
                const profileData = archaeologistSnap.data();
                return {
                  ...feedback,
                  userDisplayName: profileData.displayName,
                  userInstitution: profileData.institution,
                  userCredentials: profileData.credentials
                };
              }
            } catch (error) {
              console.error('Error fetching user profile for userId:', feedback.userId, error);
            }
          }
          return feedback;
        })
      );

      console.log('✅ Fetched feedback count:', enrichedFeedback.length);
      return enrichedFeedback;
    } catch (error) {
      console.error('❌ Error fetching feedback:', error);
      throw error;
    }
  }
}
