import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

// Fetch all featured rides
export const getFeaturedRides = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'featuredRides'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching featured rides:', error);
    return [];
  }
};
