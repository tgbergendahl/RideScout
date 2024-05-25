import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export const getFeaturedRides = async () => {
  const snapshot = await getDocs(collection(db, 'featuredRides'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
