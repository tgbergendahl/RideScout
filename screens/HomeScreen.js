import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, RefreshControl, TouchableOpacity, Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getPosts, deletePost, likePost } from '../api/posts';
import { db, auth } from '../firebaseConfig';
import { collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import logo from '../assets/RideScout.jpg';
import defaultProfile from '../assets/defaultProfile.png';

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const postsQuery = query(collection(db, 'RideScout/Data/Posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(fetchedPosts);
      fetchUserData(fetchedPosts);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (posts) => {
    const userIds = [...new Set(posts.map(post => post.userId))];
    const userPromises = userIds.map(userId => getDoc(doc(db, 'RideScout/Data/Users', userId)));
    const userDocs = await Promise.all(userPromises);
    const usersData = {};
    userDocs.forEach(userDoc => {
      if (userDoc.exists()) {
        usersData[userDoc.id] = userDoc.data();
      }
    });
    setUsers(usersData);
  };

  const onRefresh = () => {
    setRefreshing(true);
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
      <View style={styles.userInfo}>
        <Image
          source={users[item.userId]?.profileImage ? { uri: users[item.userId].profileImage } : defaultProfile}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{users[item.userId]?.username || 'Unknown User'}</Text>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      {item.imageUrls && item.imageUrls.length > 0 ? (
        item.imageUrls.map((url, index) => (
          <Image
            key={index}
            source={{ uri: url }}
            style={styles.image}
            onError={() => (e.target.src = 'Image not available')}
          />
        ))
      ) : (
        <Text>Image not available</Text>
      )}
      <Text style={styles.timestamp}>{new Date(item.createdAt?.seconds * 1000).toLocaleString()}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleLikePost(item.id)} style={styles.actionButton}>
          <Icon name="thumbs-up" size={20} color="#000" />
          <Text>{item.likesCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Comments', { postId: item.id })} style={styles.actionButton}>
          <Icon name="comment" size={20} color="#000" />
          <Text>{item.commentsCount}</Text>
        </TouchableOpacity>
        {item.userId === currentUser.uid && (
          <TouchableOpacity onPress={() => handleDeletePost(item.id)} style={styles.actionButton}>
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
        <View style={styles.buttonContainer}>
          <Button title="Create Post" onPress={() => navigation.navigate('CreatePost')} />
        </View>
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
    backgroundColor: '#ffffff',
  },
  header: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  buttonContainer: {
    marginTop: 10,
  },
  postContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  actions: {
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
