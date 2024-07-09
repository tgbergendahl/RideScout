import { db } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, arrayUnion, increment, serverTimestamp } from 'firebase/firestore';
import { sendNotification } from './notifications';

// Function to get comments for a post
export const getComments = async (postId) => {
  const q = query(collection(db, 'RideScout/Data/Comments'), where('postId', '==', postId));
  const querySnapshot = await getDocs(q);
  const comments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return comments;
};

// Function to add a comment to a post
export const addComment = async (postId, content, userId) => {
  const commentRef = await addDoc(collection(db, 'RideScout/Data/Comments'), {
    postId,
    content,
    userId,
    createdAt: serverTimestamp(),
    likesCount: 0,
  });

  // Update the comments count in the post document
  const postRef = doc(db, 'RideScout/Data/Posts', postId);
  await updateDoc(postRef, {
    commentsCount: increment(1),
    comments: arrayUnion(commentRef.id),
  });

  // Send notification to the post owner
  const postSnapshot = await getDoc(postRef);
  if (postSnapshot.exists()) {
    const postData = postSnapshot.data();
    if (postData.userId !== userId) {
      await sendNotification(postData.userId, userId, 'comment', postId);
    }
  }
};

// Function to like a comment
export const likeComment = async (commentId, userId) => {
  const commentRef = doc(db, 'RideScout/Data/Comments', commentId);
  await updateDoc(commentRef, {
    likesCount: increment(1),
    likes: arrayUnion(userId),
  });

  // Send notification to the comment owner
  const commentSnapshot = await getDoc(commentRef);
  if (commentSnapshot.exists()) {
    const commentData = commentSnapshot.data();
    if (commentData.userId !== userId) {
      await sendNotification(commentData.userId, userId, 'like', commentData.postId, commentId);
    }
  }
};
