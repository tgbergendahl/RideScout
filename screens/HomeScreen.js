import React, { useState, useEffect } from 'react';
import { View, Button, FlatList, StyleSheet, Image, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getPosts, deletePost, likePost } from '../api/posts';
import { db, auth } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import Post from '../components/Post';
import logo from '../assets/Ride scout (2).jpg'; // Ensure the correct path to your logo image

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'RideScout/Data/Posts'), (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (postId) => {
    try {
      const post = posts.find(post => post.id === postId);
      if (post.userId === currentUser.uid) {
        await deletePost(postId);
      } else {
        console.error('Error deleting post: insufficient permissions');
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      <Button title="Create Post" onPress={() => navigation.navigate('CreatePost')} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Post 
            post={item} 
            onLike={handleLike} 
            onComment={handleComment} 
            onDelete={handleDelete}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    width: '100%',
    height: 80, // Increased height to accommodate larger logo
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 10, // Added padding for better spacing
  },
  logo: {
    width: 200, // Adjusted size
    height: 500, // Adjusted size
    resizeMode: 'contain', // Ensures the logo maintains its aspect ratio
  },
});

export default HomeScreen;
