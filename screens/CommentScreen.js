import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Comment from '../components/Comment';

const CommentScreen = ({ route }) => {
  const { postId } = route.params;

  return (
    <View style={styles.container}>
      <Comment postId={postId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default CommentScreen;
