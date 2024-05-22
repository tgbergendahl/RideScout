// components/Comment.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

const Comment = ({ postId }) => {
  const [comment, setComment] = useState('');

  const handleComment = async () => {
    await addDoc(collection(db, 'posts', postId, 'comments'), {
      text: comment,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    });
    setComment('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add a comment"
        value={comment}
        onChangeText={setComment}
      />
      <Button title="Post Comment" onPress={handleComment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
});

export default Comment;
