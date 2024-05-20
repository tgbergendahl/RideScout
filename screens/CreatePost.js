// screens/CreatePost.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CreatePost = () => {
  return (
    <View style={styles.container}>
      <Text>Create Post Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CreatePost;
