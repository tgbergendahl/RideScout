// api/scenicSpots.js
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Create a new scenic spot
export const createScenicSpot = async (spotData) => {
  try {
    await addDoc(collection(db, 'scenicSpots'), {
      ...spotData,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error creating scenic spot:', error);
  }
};
