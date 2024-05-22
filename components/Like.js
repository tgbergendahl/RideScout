// components/Like.js
import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const Like = ({ postId }) => {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      const postDoc = await getDoc(doc(db, 'posts', postId));
      if (postDoc.exists()) {
        const data = postDoc.data();
        setLikes(data.likes ? data.likes.length : 0);
        setLiked(data.likes && data.likes.includes(auth.currentUser.uid));
      }
    };

    fetchLikes();
  }, []);

  const handleLike = async () => {
    const postRef = doc(db, 'posts', postId);
    if (liked) {
      await updateDoc(postRef, {
        likes: arrayRemove(auth.currentUser.uid),
      });
      setLikes(likes - 1);
      setLiked(false);
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(auth.currentUser.uid),
      });
      setLikes(likes + 1);
      setLiked(true);
    }
  };

  return (
    <View>
      <Button title={liked ? 'Unlike' : 'Like'} onPress={handleLike} />
      <Text>{likes} likes</Text>
    </View>
  );
};

export default Like;
