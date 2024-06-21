// api/users.js
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

// Update user profile
export const updateProfile = async (userId, profileData) => {
  try {
    await updateDoc(doc(db, 'users', userId), profileData);
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};
