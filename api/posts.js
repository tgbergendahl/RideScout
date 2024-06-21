import { db } from '../firebase';
import { collection, doc, deleteDoc, getDocs, addDoc, updateDoc, getDoc, increment, serverTimestamp } from 'firebase/firestore';

// Fetch all posts
export const getPosts = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'RideScout/Data/Posts'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

// Fetch a single post by ID
export const getPostById = async (postId) => {
  try {
    const postDoc = await getDoc(doc(db, 'RideScout/Data/Posts', postId));
    return postDoc.exists() ? { id: postDoc.id, ...postDoc.data() } : null;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return null;
  }
};

// Delete a post by ID
export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, 'RideScout/Data/Posts', postId));
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};

// Create a new post
export const createPost = async (postData) => {
  try {
    await addDoc(collection(db, 'RideScout/Data/Posts'), {
      ...postData,
      createdAt: serverTimestamp(),
      likesCount: 0,
      commentsCount: 0,
      likes: [],
      comments: []
    });
  } catch (error) {
    console.error("Error creating post:", error);
  }
};

// Like or unlike a post
export const likePost = async (postId, userId) => {
  const postRef = doc(db, 'RideScout/Data/Posts', postId);
  try {
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
      const postData = postDoc.data();
      let likes = postData.likes || [];
      if (!likes.includes(userId)) {
        likes.push(userId);
        await updateDoc(postRef, { likesCount: likes.length, likes });
      } else {
        likes = likes.filter(id => id !== userId);
        await updateDoc(postRef, { likesCount: likes.length, likes });
      }
    }
  } catch (error) {
    console.error("Error liking post:", error);
  }
};

// Add a comment to a post
export const addComment = async (postId, comment) => {
  const postRef = doc(db, 'RideScout/Data/Posts', postId);
  try {
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
      const postData = postDoc.data();
      const comments = postData.comments || [];
      comments.push({
        ...comment,
        createdAt: serverTimestamp()
      });
      await updateDoc(postRef, { commentsCount: comments.length, comments });
    }
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};

// Fetch comments for a post
export const getComments = async (postId) => {
  try {
    const postDoc = await getDoc(doc(db, 'RideScout/Data/Posts', postId));
    if (postDoc.exists()) {
      const postData = postDoc.data();
      return postData.comments || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};
