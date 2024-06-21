import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

// Fetch all hogs
export const getHogs = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'hogs'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching hogs:', error);
    return [];
  }
};
