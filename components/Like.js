import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const likePost = async (postId, userId) => {
  try {
    const postRef = doc(db, 'RideScout/Data/Posts', postId);
    const postSnapshot = await getDoc(postRef);
    if (postSnapshot.exists()) {
      const postData = postSnapshot.data();
      const likes = postData.likes || [];
      if (!likes.includes(userId)) {
        likes.push(userId);
        await updateDoc(postRef, { likes, likesCount: likes.length });
        console.log('Post liked by user:', userId); // Log liked post by user
      }
    }
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};
