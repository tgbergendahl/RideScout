import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export const createScenicSpot = async (spotData) => {
  await addDoc(collection(db, 'scenicSpots'), spotData);
};
