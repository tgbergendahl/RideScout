// PostDetail.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getPostById, addComment, getComments } from '../api/posts';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth } from '../firebase';

const PostDetail = () => {
  const route = useRoute();
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchPost = async () => {
      const postData = await getPostById(postId);
      setPost(postData);
    };

    const fetchComments = async () => {
      const commentsData = await getComments(postId);
      setComments(commentsData);
    };

    fetchPost();
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await addComment(postId, currentUser.uid, newComment);
      setNewComment('');
      const commentsData = await getComments(postId);
      setComments(commentsData);
    }
  };

  if (!post) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/Ride scout (2).jpg')} style={styles.logo} />
      </View>
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <Text style={styles.postUser}>{post.userName}</Text>
          <Text style={styles.postTime}>{new Date(post.timestamp).toLocaleString()}</Text>
        </View>
        <Text style={styles.postContent}>{post.content}</Text>
        {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}
      </View>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Text style={styles.commentUser}>{item.userName}</Text>
            <Text style={styles.commentText}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.addCommentContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={handleAddComment} style={styles.addCommentButton}>
          <Icon name="send" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    height: 150, // Same height as in HomeScreen
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  logo: {
    width: 300, // Same size as in HomeScreen
    height: 150, // Same size as in HomeScreen
    resizeMode: 'contain',
  },
  postContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
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
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  commentContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 14,
    marginTop: 5,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 10,
  },
  commentInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
  },
  addCommentButton: {
    padding: 10,
  },
});

export default PostDetail;
