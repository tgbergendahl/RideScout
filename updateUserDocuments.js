// updateUserDocuments.js
const { db } = require('./firebaseConfigNode');
const { getDocs, collection, updateDoc, arrayUnion, arrayRemove } = require('firebase/firestore');

const updateUserDocuments = async () => {
  try {
    const usersCollection = collection(db, 'RideScout/Data/Users');
    const usersSnapshot = await getDocs(usersCollection);

    const updatePromises = usersSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const updateData = {};
      if (!data.followersArray) {
        updateData.followersArray = [];
      }
      if (!data.followingArray) {
        updateData.followingArray = [];
      }
      if (Object.keys(updateData).length > 0) {
        return updateDoc(doc.ref, updateData);
      }
    });

    await Promise.all(updatePromises);
    console.log('User documents updated successfully');
  } catch (error) {
    console.error('Error updating user documents:', error);
  }
};

updateUserDocuments();
