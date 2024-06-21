// components/Like.js
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
      const postDoc = await getDoc(doc(db, 'RideScout/Data/Posts', postId));
      if (postDoc.exists()) {
        const postData = postDoc.data();
        if (postData.likedBy && postData.likedBy.includes(currentUser.uid)) {
          setLiked(true);
        }
      }
    };
    checkIfLiked();
  }, [db, postId, currentUser.uid]);

  const handleLike = async () => {
    const postRef = doc(db, 'RideScout/Data/Posts', postId);
    if (!liked) {
      await updateDoc(postRef, {
        likes: increment(1),
        likedBy: currentUser.uid ? increment(1) : [],
      });
      setLikes(likes + 1);
      setLiked(true);
    } else {
      await updateDoc(postRef, {
        likes: increment(-1),
        likedBy: currentUser.uid ? increment(-1) : [],
      });
      setLikes(likes - 1);
      setLiked(false);
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
    alignItems: 'center',
  },
  liked: {
    color: 'blue',
  },
  unliked: {
    color: 'gray',
  },
  likeCount: {
    marginLeft: 10,
  },
});

export default Like;
