import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Post = ({ post, onLike, onComment, onDelete }) => {
  return (
    <View style={styles.postItem}>
      {post.imageUrl && <Image source={{ uri: post.imageUrl }} style={styles.image} />}
      <Text>{post.content}</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => onComment(post.id)}>
          <Icon name="comment" size={30} color="blue" />
          <Text>{post.commentsCount || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onLike(post.id)}>
          <Icon name="thumbs-up" size={30} color="blue" />
          <Text>{post.likesCount || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(post.id)}>
          <Icon name="trash" size={30} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postItem: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
});

export default Post;
