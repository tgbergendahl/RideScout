import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image, RefreshControl, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getPosts, deletePost, likePost } from '../api/posts';
import { db, auth } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
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
    }, (error) => {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'There was an issue connecting to Firestore. Please try again later.');
    });

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
        <Text style={styles.postTime}>{new Date(item.timestamp).toLocaleString()}</Text>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.postImage} />}
      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.actionButton}>
          <Icon name="thumbs-up" size={20} color="#000" />
          <Text>{item.likeCount || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleComment(item.id)} style={styles.actionButton}>
          <Icon name="comment" size={20} color="#000" />
          <Text>{item.commentCount || 0}</Text>
        </TouchableOpacity>
        {item.userId === currentUser.uid && (
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
            <Icon name="trash" size={20} color="#000" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      <TouchableOpacity style={styles.createPostButton} onPress={() => navigation.navigate('CreatePost')}>
        <Text style={styles.createPostButtonText}>Create Post</Text>
      </TouchableOpacity>
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
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    width: '100%',
    height: 150, // Increased height to accommodate larger logo
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 10, // Added padding for better spacing
  },
  logo: {
    width: 300, // Adjusted size
    height: 150, // Adjusted size
    resizeMode: 'contain', // Ensures the logo maintains its aspect ratio
  },
  createPostButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  createPostButtonText: {
    color: '#fff',
    fontSize: 16,
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
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default HomeScreen;
