import { db } from '../firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';

export const getComments = async (postId) => {
  const q = query(collection(db, 'RideScout/Data/Comments'), where('postId', '==', postId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addComment = async (postId, content, userId) => {
  await addDoc(collection(db, 'RideScout/Data/Comments'), { postId, content, userId, createdAt: new Date() });
};
