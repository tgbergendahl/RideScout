import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { sendNotification } from './notifications';

export const likePost = async (postId, userId) => {
  try {
    const postRef = doc(db, 'RideScout/Data/Posts', postId);
    const postSnapshot = await getDoc(postRef);
    if (postSnapshot.exists()) {
      const postData = postSnapshot.data();
      const likes = postData.likes || [];
      if (!likes.includes(userId)) {
        await updateDoc(postRef, {
          likes: arrayUnion(userId),
          likesCount: increment(1)
        });

        // Send notification to the post owner
        if (postData.userId !== userId) {
          await sendNotification(postData.userId, userId, 'like', postId);
        }
      } else {
        await updateDoc(postRef, {
          likes: arrayRemove(userId),
          likesCount: increment(-1)
        });
      }
    }
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};
