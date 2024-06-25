import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import scenicSpotsData from './scenicSpotsData';

const addScenicSpots = async (spots) => {
  const spotsCollection = collection(db, 'scenicSpots');
  for (const spot of spots) {
    await addDoc(spotsCollection, spot);
  }
};

// Call the function to add the scenic spots
addScenicSpots(scenicSpotsData)
  .then(() => console.log("Scenic spots added successfully!"))
  .catch((error) => console.error("Error adding scenic spots: ", error));
