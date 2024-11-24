import { collection, addDoc, query, getDocs, orderBy, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Score {
  name: string;
  email: string;
  wpm: number;
  accuracy: number;
  difficulty: string;
  duration: number;
  timestamp: number;
}

export const saveScore = async (score: Score) => {
  try {
    await addDoc(collection(db, 'scores'), score);
  } catch (error) {
    console.error('Error saving score:', error);
    throw error;
  }
};

export const getScores = async () => {
  try {
    const scoresRef = collection(db, 'scores');
    const q = query(scoresRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (Score & { id: string })[];
  } catch (error) {
    console.error('Error fetching scores:', error);
    // Return empty array instead of throwing
    return [];
  }
};

export const getUserScores = async (email: string) => {
  try {
    // First try to get scores without ordering to avoid index issues
    const scoresRef = collection(db, 'scores');
    const q = query(scoresRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort((a, b) => b.timestamp - a.timestamp) as (Score & { id: string })[];
  } catch (error) {
    console.error('Error fetching user scores:', error);
    // Return empty array instead of throwing
    return [];
  }
};