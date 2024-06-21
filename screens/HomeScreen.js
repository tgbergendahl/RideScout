// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Button, Image, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getPosts, deletePost, likePost } from '../api/posts';
import { db, auth } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import logo from '../assets/RideScout.jpg'; // Ensure the correct path to your logo image

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'RideScout/Data/Posts'),
      (snapshot) => {
        const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
      },
      (error) => {
        console.error('Error fetching posts:', error);
        Alert.alert('Error', 'There was an issue connecting to Firestore. Please try again later.');
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (postId) => {
    try {
      const post = posts.find(post => post.id === postId);
      if (post.userId === currentUser.uid) {
        await deletePost(postId);
      } else {
        Alert.alert('Error', 'You can only delete your own posts.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await likePost(postId, currentUser.uid);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = (postId) => {
    navigation.navigate('Comments', { postId });
  };

  const onRefresh = () => {
    setRefreshing(true);
    const fetchPosts = async () => {
      const data = await getPosts();
      setPosts(data);
      setRefreshing(false);
    };
    fetchPosts();
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { postId: item.id })} style={styles.postContainer}>
      <View style={styles.postHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: item.userId })}>
          <Text style={styles.postUser}>{item.userName}</Text>
        </TouchableOpacity>
        <Text style={styles.postTime}>{new Date(item.createdAt.toDate()).toLocaleString()}</Text>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      {item.imageUrls && item.imageUrls.map((url, index) => (
        <Image key={index} source={{ uri: url }} style={styles.image} />
      ))}
      {item.videoUrl && <Video source={{ uri: item.videoUrl }} style={styles.video} />}
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.actionButton}>
          <Icon name="thumbs-up" size={20} color="blue" />
          <Text>{item.likesCount || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleComment(item.id)} style={styles.actionButton}>
          <Icon name="comment" size={20} color="blue" />
          <Text>{item.commentsCount || 0}</Text>
        </TouchableOpacity>
        {item.userId === currentUser.uid && (
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
            <Icon name="trash" size={20} color="red" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Button
        title="Create Post"
        onPress={() => navigation.navigate('CreatePost')}
      />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
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
  postContainer: {
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default HomeScreen;
