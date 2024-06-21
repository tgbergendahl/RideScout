import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Post = ({ post, onLike, onComment, onDelete }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.content}>{post.content}</Text>
      {post.imageUrls && post.imageUrls.length > 0 && (
        <Image source={{ uri: post.imageUrls[0] }} style={styles.image} />
      )}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={onLike}>
          <Icon name="thumb-up" size={20} color="white" />
          <Text style={styles.buttonText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onComment}>
          <Icon name="comment" size={20} color="white" />
          <Text style={styles.buttonText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onDelete(post.id)}>
          <Icon name="delete" size={20} color="white" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
  },
});

export default Post;
