// api/follow.js
import { db, auth } from '../firebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';

export const followUser = async (targetUserId) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('User not authenticated');

  const currentUserRef = doc(db, 'RideScout/Data/Users', currentUser.uid);
  const targetUserRef = doc(db, 'RideScout/Data/Users', targetUserId);

  try {
    console.log(`Following user ${targetUserId} from ${currentUser.uid}`);

    // Update current user's following array
    await updateDoc(currentUserRef, {
      followingArray: arrayUnion(targetUserId),
      following: increment(1), // Increment the following count
    });

    // Update target user's followers array
    await updateDoc(targetUserRef, {
      followersArray: arrayUnion(currentUser.uid),
      followers: increment(1), // Increment the followers count
    });

    console.log(`Successfully followed user: ${targetUserId}`);
  } catch (error) {
    console.error("Error following user: ", error);
    throw error;
  }
};

export const unfollowUser = async (targetUserId) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('User not authenticated');

  const currentUserRef = doc(db, 'RideScout/Data/Users', currentUser.uid);
  const targetUserRef = doc(db, 'RideScout/Data/Users', targetUserId);

  try {
    console.log(`Unfollowing user ${targetUserId} from ${currentUser.uid}`);

    // Update current user's following array
    await updateDoc(currentUserRef, {
      followingArray: arrayRemove(targetUserId),
      following: increment(-1), // Decrement the following count
    });

    // Update target user's followers array
    await updateDoc(targetUserRef, {
      followersArray: arrayRemove(currentUser.uid),
      followers: increment(-1), // Decrement the followers count
    });

    console.log(`Successfully unfollowed user: ${targetUserId}`);
  } catch (error) {
    console.error("Error unfollowing user: ", error);
    throw error;
  }
};
