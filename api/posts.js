import { db } from '../firebase';
import { collection, doc, deleteDoc, getDocs, addDoc, updateDoc, getDoc } from 'firebase/firestore';

export const getPosts = async () => {
  const snapshot = await getDocs(collection(db, 'RideScout/Data/Posts'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deletePost = async (postId) => {
  await deleteDoc(doc(db, 'RideScout/Data/Posts', postId));
};

export const createPost = async (postData) => {
  await addDoc(collection(db, 'RideScout/Data/Posts'), postData);
};

export const likePost = async (postId, userId) => {
  const postRef = doc(db, 'RideScout/Data/Posts', postId);
  const postDoc = await getDoc(postRef);
  if (postDoc.exists()) {
    const postData = postDoc.data();
    const likes = postData.likes || [];
    if (!likes.includes(userId)) {
      likes.push(userId);
      await updateDoc(postRef, { likesCount: likes.length, likes });
    }
  }
};

export const addComment = async (postId, comment) => {
  const postRef = doc(db, 'RideScout/Data/Posts', postId);
  const postDoc = await getDoc(postRef);
  if (postDoc.exists()) {
    const postData = postDoc.data();
    const comments = postData.comments || [];
    comments.push(comment);
    await updateDoc(postRef, { commentsCount: comments.length, comments });
  }
};
