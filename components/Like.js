import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc, increment } from 'firebase/firestore';

const Like = ({ postId, initialLikes }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    // Check if the user has already liked the post (this can be extended by checking a 'likes' collection in Firestore)
  }, []);

  const handleLike = async () => {
    if (!liked) {
      await updateDoc(doc(db, 'RideScout/Data/Posts', postId), {
        likes: increment(1)
      });
      setLikes(likes + 1);
      setLiked(true);
    } else {
      await updateDoc(doc(db, 'RideScout/Data/Posts', postId), {
        likes: increment(-1)
      });
      setLikes(likes - 1);
      setLiked(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLike}>
        <Text style={liked ? styles.liked : styles.unliked}>Like</Text>
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
