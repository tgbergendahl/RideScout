import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const postsCollection = collection(db, 'RideScout/Data/Posts');

export const getPosts = async () => {
  try {
    const snapshot = await getDocs(postsCollection);
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Fetched posts:', posts); // Log fetched posts
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const createPost = async (post) => {
  try {
    const docRef = await addDoc(postsCollection, post);
    console.log('Post created with ID:', docRef.id); // Log created post ID
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const postRef = doc(db, 'RideScout/Data/Posts', postId);
    await deleteDoc(postRef);
    console.log('Post deleted with ID:', postId); // Log deleted post ID
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

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
