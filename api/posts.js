import { db } from '../firebaseConfig';
import { collection, doc, deleteDoc, getDocs, addDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Fetch all posts
export const getPosts = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'RideScout/Data/Posts'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
};

// Fetch a single post by ID
export const getPostById = async (postId) => {
  try {
    const postDoc = await getDoc(doc(db, 'RideScout/Data/Posts', postId));
    if (postDoc.exists()) {
      return { id: postDoc.id, ...postDoc.data() };
    } else {
      console.error(`Post with ID ${postId} does not exist`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw new Error("Failed to fetch post by ID");
  }
};

// Delete a post by ID
export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, 'RideScout/Data/Posts', postId));
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Failed to delete post");
  }
};

// Create a new post
export const createPost = async (postData) => {
  try {
    const newPostData = {
      ...postData,
      createdAt: serverTimestamp(),
      likesCount: 0,
      commentsCount: 0,
      likes: [],
      comments: []
    };

    if (!newPostData.imageUrls || newPostData.imageUrls.length === 0) {
      newPostData.imageUrls = ['']; // Placeholder to avoid empty image URL errors
    }

    await addDoc(collection(db, 'RideScout/Data/Posts'), newPostData);
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
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
    } else {
      console.error(`Post with ID ${postId} does not exist`);
    }
  } catch (error) {
    console.error("Error liking post:", error);
    throw new Error("Failed to like post");
  }
};

// Add a comment to a post
export const addCommentToPost = async (postId, comment) => {
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
    } else {
      console.error(`Post with ID ${postId} does not exist`);
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Failed to add comment");
  }
};

// Fetch comments for a post
export const getPostComments = async (postId) => {
  try {
    const postDoc = await getDoc(doc(db, 'RideScout/Data/Posts', postId));
    if (postDoc.exists()) {
      const postData = postDoc.data();
      return postData.comments || [];
    } else {
      console.error(`Post with ID ${postId} does not exist`);
      return [];
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  }
};
