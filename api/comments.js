import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, query, where, orderBy, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

// Fetch comments for a specific post
export const getComments = async (postId) => {
  try {
    const q = query(
      collection(db, 'RideScout/Data/Comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

// Add a new comment to a specific post
export const addComment = async (postId, content, userId) => {
  try {
    await addDoc(collection(db, 'RideScout/Data/Comments'), {
      postId,
      content,
      userId,
      createdAt: serverTimestamp()
    });
    // Update comment count in the post
    const postRef = doc(db, 'RideScout/Data/Posts', postId);
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
      const postData = postDoc.data();
      const commentsCount = (postData.commentsCount || 0) + 1;
      await updateDoc(postRef, { commentsCount });
    }
  } catch (error) {
    console.error('Error adding comment:', error);
  }
};
