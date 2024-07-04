// api/users.js
import { db } from '../firebaseConfig';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

// Update user profile
export const updateProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'RideScout/Data/Users', userId);

    // Check if followersArray and followingArray exist, if not, initialize them
    const updatedProfileData = {
      ...profileData,
      followersArray: profileData.followersArray || [],
      followingArray: profileData.followingArray || [],
    };

    await updateDoc(userRef, updatedProfileData);
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};

// Create user profile
export const createUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'RideScout/Data/Users', userId);
    await setDoc(userRef, {
      ...profileData,
      followersArray: profileData.followersArray || [],
      followingArray: profileData.followingArray || [],
    });
  } catch (error) {
    console.error('Error creating profile:', error);
  }
};
