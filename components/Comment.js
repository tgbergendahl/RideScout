import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getComments, addComment } from '../api/comments';

const Comment = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await getComments(postId);
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (currentUser && comment.trim()) {
      try {
        await addComment(postId, comment.trim(), currentUser.uid);
        setComment('');
        const commentsData = await getComments(postId);
        setComments(commentsData);
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.comment}>
      <Text style={styles.commentText}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>No comments yet.</Text>}
      />
      <TextInput
        style={styles.input}
        placeholder="Add a comment"
        value={comment}
        onChangeText={setComment}
      />
      <Button title="Post Comment" onPress={handleAddComment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  comment: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  commentText: {
    fontSize: 16
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10
  }
});

export default Comment;
