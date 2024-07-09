import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, RefreshControl, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { doc, getDoc, collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';
import defaultProfile from '../assets/defaultProfile.png';
import { likePost } from '../api/like';
import { followUser, unfollowUser } from '../api/follow';

const RiderProfile = ({ route, navigation }) => {
  const { userId } = route.params;
  const currentUser = auth.currentUser;
  const [rider, setRider] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = fetchRiderData();
      return () => unsubscribe();
    }
  }, [userId, currentUser]);

  const fetchRiderData = () => {
    const riderRef = doc(db, 'RideScout/Data/Users', userId);
    const unsubscribe = onSnapshot(riderRef, async (riderDoc) => {
      if (riderDoc.exists()) {
        const riderData = riderDoc.data();
        riderData.followersArray = riderData.followersArray || [];
        riderData.followingArray = riderData.followingArray || [];
        setRider({ id: riderDoc.id, ...riderData });
        setIsFollowing(riderData.followersArray.includes(currentUser.uid));
        await fetchUserPosts();
      } else {
        Alert.alert('Error', 'No rider data found.');
      }
    }, (error) => {
      Alert.alert('Error', `There was an issue fetching the rider data: ${error.message}`);
    });
    return unsubscribe;
  };

  const fetchUserPosts = async () => {
    try {
      const postsQuery = query(collection(db, 'RideScout/Data/Posts'), where('userId', '==', userId));
      const postsSnapshot = await getDocs(postsQuery);
      const fetchedPosts = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', `There was an issue fetching the posts: ${error.message}`);
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRiderData(); // Removed .then() since fetchRiderData doesn't return a promise
    setRefreshing(false);
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
      setIsFollowing(!isFollowing);
      fetchRiderData(); // Ensure profile data is updated
    } catch (error) {
      Alert.alert('Error', `There was an issue updating the follow status: ${error.message}`);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await likePost(postId, currentUser.uid);
    } catch (error) {
      Alert.alert('Error', `There was an issue liking the post: ${error.message}`);
    }
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postContent}>{item.content}</Text>
      {item.imageUrls && item.imageUrls.length > 0 ? (
        item.imageUrls.map((url, index) => (
          <Image
            key={index}
            source={{ uri: url }}
            style={styles.image}
          />
        ))
      ) : (
        <Text>Image not available</Text>
      )}
      <Text style={styles.timestamp}>{new Date(item.createdAt.seconds * 1000).toLocaleString()}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleLikePost(item.id)} style={styles.actionButton}>
          <Icon name="thumbs-up" size={20} color="#000" />
          <Text>{item.likesCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CommentScreen', { postId: item.id })} style={styles.actionButton}>
          <Icon name="comment" size={20} color="#000" />
          <Text>{item.commentsCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  if (!rider) {
    return <View><Text>No rider data found.</Text></View>;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Image
        source={rider.profileImage ? { uri: rider.profileImage } : defaultProfile}
        style={styles.profileImage}
      />
      <Text style={styles.username}>{rider.username}</Text>
      <Text style={styles.bio}>{rider.bio}</Text>
      <View style={styles.followContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Followers', { userId: rider.id })}>
          <Text style={styles.followCount}>{rider.followersArray.length} Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Following', { userId: rider.id })}>
          <Text style={styles.followCount}>{rider.followingArray.length} Following</Text>
        </TouchableOpacity>
      </View>
      {currentUser && currentUser.uid !== userId && (
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={handleFollow} style={styles.button}>
            <Text style={styles.buttonText}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Inbox', { recipientId: rider.id })} style={styles.button}>
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  followContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  followCount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
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

export default RiderProfile;
