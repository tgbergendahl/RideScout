import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Like from './Like'; // Make sure to adjust the path if necessary

const Post = ({ post, onComment, onDelete }) => {
  return (
    <View style={styles.postItem}>
      <View style={styles.postHeader}>
        <Text style={styles.postUser}>{post.userName}</Text>
        <Text style={styles.postTime}>{new Date(post.timestamp).toLocaleString()}</Text>
      </View>
      {post.imageUrl && <Image source={{ uri: post.imageUrl }} style={styles.image} />}
      <Text style={styles.postContent}>{post.content}</Text>
      <View style={styles.actionsContainer}>
        <Like postId={post.id} initialLikes={post.likesCount || 0} />
        <TouchableOpacity onPress={() => onComment(post.id)} style={styles.actionButton}>
          <Icon name="comment" size={20} color="blue" />
          <Text>{post.commentsCount || 0}</Text>
        </TouchableOpacity>
        {post.userId === auth.currentUser.uid && (
          <TouchableOpacity onPress={() => onDelete(post.id)} style={styles.actionButton}>
            <Icon name="trash" size={20} color="red" />
          </TouchableOpacity>
        )}
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
    borderColor: '#ccc',
    borderWidth: 1,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  postUser: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postTime: {
    fontSize: 12,
    color: '#888',
  },
  postContent: {
    fontSize: 14,
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Post;
