import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export const updateProfile = async (userId, profileData) => {
  await updateDoc(doc(db, 'users', userId), profileData);
};
