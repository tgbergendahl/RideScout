import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export const getHogs = async () => {
  const snapshot = await getDocs(collection(db, 'hogs'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
