import { db } from '../firebaseConfig';
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';

const updateFollowersAndFollowing = async () => {
  try {
    const usersCollection = collection(db, 'RideScout', 'Data', 'Users');
    const usersSnapshot = await getDocs(usersCollection);

    const users = {};
    usersSnapshot.forEach(doc => {
      users[doc.id] = doc.data();
    });

    for (const [userId, userData] of Object.entries(users)) {
      const { followingArray = [] } = userData;

      for (const followedUserId of followingArray) {
        if (followedUserId) {
          const followedUserRef = doc(db, 'RideScout', 'Data', 'Users', followedUserId);
          await updateDoc(followedUserRef, {
            followersArray: arrayUnion(userId),
          });
          console.log(`Updated followers for user: ${followedUserId} to include: ${userId}`);
        }
      }
    }

    console.log('Update complete.');
  } catch (error) {
    console.error('Error updating followers and following:', error);
  }
};

updateFollowersAndFollowing();
