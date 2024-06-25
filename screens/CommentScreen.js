import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TextInput, Button } from 'react-native';
import Comment from '../components/Comment';
import { getComments, addComment } from '../api/comments';
import { auth } from '../firebaseConfig';

const CommentScreen = ({ route }) => {
  const { postId } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const fetchedComments = await getComments(postId);
    setComments(fetchedComments);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await addComment(postId, newComment, auth.currentUser.uid);
      setNewComment('');
      fetchComments();
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Comment comment={item} />}
        ListEmptyComponent={<Text>Be the first to comment</Text>}
      />
      <TextInput
        style={styles.input}
        value={newComment}
        onChangeText={setNewComment}
        placeholder="Write a comment..."
      />
      <Button title="Add Comment" onPress={handleAddComment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10
  }
});

export default CommentScreen;
