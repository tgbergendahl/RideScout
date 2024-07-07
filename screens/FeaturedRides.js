import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Image, RefreshControl, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import logo from '../assets/RideScout.jpg';
import defaultProfile from '../assets/defaultProfile.png';
import { deletePost } from '../api/posts';
import { likePost } from '../api/like';

const FeaturedRides = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    fetchFeaturedPosts(true);
  }, []);

  const fetchFeaturedPosts = async (refresh = false) => {
    try {
      const postsQuery = query(collection(db, 'RideScout', 'Data', 'Posts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(postsQuery);
      const fetchedPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort posts by likesCount and createdAt in descending order
      fetchedPosts.sort((a, b) => {
        if (b.likesCount !== a.likesCount) {
          return b.likesCount - a.likesCount;
        } else {
          return b.createdAt.seconds - a.createdAt.seconds;
        }
      });

      setPosts(fetchedPosts);
      fetchUserData(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts: ", error);
      setLoading(false);
    }
  };

  const fetchUserData = async (posts) => {
    console.log("Fetching user data...");
    const userIds = [...new Set(posts.map(post => post.userId).filter(userId => userId))];
    console.log("User IDs: ", userIds);

    const userPromises = userIds.map(userId => getDoc(doc(db, 'RideScout', 'Data', 'Users', userId)));
    const userDocs = await Promise.all(userPromises);

    const usersData = {};
    userDocs.forEach(userDoc => {
      if (userDoc.exists()) {
        usersData[userDoc.id] = userDoc.data();
      }
    });

    console.log("Fetched users data: ", usersData);
    setUsers(usersData);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeaturedPosts(true).then(() => setRefreshing(false));
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      Alert.alert('Success', 'Post deleted successfully.');
      fetchFeaturedPosts(true);
    } catch (error) {
      Alert.alert('Error', 'There was an issue deleting the post.');
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await likePost(postId, currentUser.uid);
      fetchFeaturedPosts(true);
    } catch (error) {
      Alert.alert('Error', 'There was an issue liking the post.');
    }
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.userInfo}>
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Image
            source={users[item.userId]?.profileImage ? { uri: users[item.userId].profileImage } : defaultProfile}
            style={styles.profileImage}
          />
        )}
        <Text style={styles.username}>{users[item.userId]?.username || 'User not found'}</Text>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      {item.imageUrls && item.imageUrls.length > 0 ? (
        item.imageUrls.map((url, index) => (
          url ? (
            <Image
              key={index}
              source={{ uri: url }}
              style={styles.image}
              onError={() => console.log('Image not available')}
            />
          ) : (
            <Text key={index}>Image not available</Text>
          )
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
        <TouchableOpacity onPress={() => navigation.navigate('CommentScreen', { postId: item.id })} style={styles.actionButton}>
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
      </View>
      <TouchableOpacity style={styles.findRiderButton} onPress={() => navigation.navigate('RiderDirectory')}>
        <Text style={styles.findRiderButtonText}>Find a Rider</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id} // Ensuring unique keys for each post
          renderItem={renderPost}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onEndReached={() => fetchFeaturedPosts(false)}
          onEndReachedThreshold={0.5}
          ListFooterComponent={refreshing ? <ActivityIndicator size="large" color="#000" /> : null}
        />
      )}
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
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 10,
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  findRiderButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  findRiderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postContainer: {
    padding: 20,
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

export default FeaturedRides;
