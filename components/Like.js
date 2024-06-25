import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, increment } from 'firebase/firestore';

const Like = ({ postId, initialLikes }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const auth = getAuth();
  const db = getFirestore();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const postDoc = await getDoc(doc(db, 'RideScout/Data/Posts', postId));
        if (postDoc.exists()) {
          const postData = postDoc.data();
          if (postData.likedBy && postData.likedBy.includes(currentUser.uid)) {
            setLiked(true);
          }
        }
      } catch (error) {
        console.error("Error checking if post is liked:", error);
      }
    };
    checkIfLiked();
  }, [db, postId, currentUser.uid]);

  const handleLike = async () => {
    const postRef = doc(db, 'RideScout/Data/Posts', postId);
    try {
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const postData = postDoc.data();
        let likes = postData.likes || [];
        if (!likes.includes(currentUser.uid)) {
          likes.push(currentUser.uid);
          await updateDoc(postRef, { likesCount: increment(1), likes });
          setLikes(likes.length);
          setLiked(true);
        } else {
          likes = likes.filter(id => id !== currentUser.uid);
          await updateDoc(postRef, { likesCount: increment(-1), likes });
          setLikes(likes.length);
          setLiked(false);
        }
      } else {
        console.error(`Post with ID ${postId} does not exist`);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLike}>
        <Text style={liked ? styles.liked : styles.unliked}>
          <Icon name="thumbs-up" size={20} color={liked ? 'blue' : 'gray'} /> Like
        </Text>
      </TouchableOpacity>
      <Text style={styles.likeCount}>{likes} {likes === 1 ? 'Like' : 'Likes'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  liked: {
    color: 'blue'
  },
  unliked: {
    color: 'gray'
  },
  likeCount: {
    marginLeft: 10
  }
});

export default Like;
