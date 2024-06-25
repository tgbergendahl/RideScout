import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getPostById, getPostComments } from '../api/posts';
import { getAuth } from 'firebase/auth';
import { collection, onSnapshot, getFirestore } from 'firebase/firestore';
import Comment from '../components/Comment';
import Icon from 'react-native-vector-icons/FontAwesome';
import logo from '../assets/RideScout.jpg'; // Ensure the correct path to your logo image

const PostDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const postId = route.params.postId;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const db = getFirestore();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPostById(postId);
        setPost(postData);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    const unsubscribe = onSnapshot(
      collection(db, 'RideScout/Data/Comments'),
      (snapshot) => {
        const commentsData = snapshot.docs
          .filter(doc => doc.data().postId === postId)
          .map(doc => ({ id: doc.id, ...doc.data() }));
        setComments(commentsData);
      },
      (error) => {
        console.error('Error fetching comments:', error);
      }
    );

    fetchPost();
    return () => unsubscribe();
  }, [postId, db]);

  const renderComment = ({ item }) => (
    <View style={styles.comment}>
      <Text style={styles.commentText}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      {post && (
        <>
          <View style={styles.postHeader}>
            <Text style={styles.postUser}>{post.userName}</Text>
            <Text style={styles.postTime}>{new Date(post.createdAt.toDate()).toLocaleString()}</Text>
          </View>
          <Text style={styles.postContent}>{post.content}</Text>
          {post.imageUrls && post.imageUrls.map((url, index) => (
            <Image key={index} source={{ uri: url }} style={styles.image} />
          ))}
          {post.videoUrl && <Video source={{ uri: post.videoUrl }} style={styles.video} />}
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
          />
          <Comment postId={postId} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postUser: {
    fontWeight: 'bold',
  },
  postTime: {
    color: '#666',
  },
  postContent: {
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  video: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  comment: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  commentText: {
    fontSize: 16,
  },
});

export default PostDetail;
