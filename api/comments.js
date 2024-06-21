// api/comments.js
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';

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
  } catch (error) {
    console.error('Error adding comment:', error);
  }
};
