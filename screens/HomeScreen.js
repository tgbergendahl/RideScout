import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, RefreshControl, TouchableOpacity, Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getPosts, deletePost, likePost } from '../api/posts';
import { db, auth } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import logo from '../assets/RideScout.jpg'; // Corrected path to your logo image

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request for refreshing data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
    } catch (error) {
      Alert.alert('Error', 'There was an issue deleting the post.');
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await likePost(postId, currentUser.uid);
    } catch (error) {
      Alert.alert('Error', 'There was an issue liking the post.');
    }
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text>{item.content}</Text>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleLikePost(item.id)}>
          <Icon name="thumbs-up" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Comments', { postId: item.id })}>
          <Icon name="comment" size={20} color="#000" />
        </TouchableOpacity>
        {item.userId === currentUser.uid && (
          <TouchableOpacity onPress={() => handleDeletePost(item.id)}>
            <Icon name="trash" size={20} color="#000" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Button title="Create Post" onPress={() => navigation.navigate('CreatePost')} />
      </View>
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
    backgroundColor: '#f5f5f5', // Ensure background color is correct
    paddingHorizontal: 20,
  },
  header: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 10,
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  postContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});

export default HomeScreen;
