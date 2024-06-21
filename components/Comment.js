import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getComments, addComment } from '../api/comments'; // Adjust the path as necessary

const Comment = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchComments = async () => {
      const commentsData = await getComments(postId);
      setComments(commentsData);
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (currentUser && comment.trim()) {
      await addComment(postId, comment.trim(), currentUser.uid);
      setComment('');
      const commentsData = await getComments(postId); // Re-fetch comments to update the list
      setComments(commentsData);
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
    padding: 20,
  },
  comment: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  commentText: {
    fontSize: 16,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default Comment;
