import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, RefreshControl, Alert, ScrollView } from 'react-native';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import defaultProfile from '../assets/defaultProfile.png';
import { likePost } from '../api/like';

const RiderProfile = ({ route, navigation }) => {
  const { userId } = route.params;
  const { user: currentUser } = useAuth();
  const [rider, setRider] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (currentUser) {
      console.log('Current user ID:', currentUser.uid);
      fetchRiderData();
    } else {
      console.log('Current user is not available');
    }
  }, [userId, currentUser]);

  const fetchRiderData = async () => {
    try {
      console.log('Fetching rider data...');
      const riderDoc = await getDoc(doc(db, 'RideScout/Data/Users', userId));
      if (riderDoc.exists()) {
        const riderData = riderDoc.data();
        riderData.followersArray = riderData.followersArray || []; // Initialize followersArray field if missing
        riderData.followingArray = riderData.followingArray || []; // Initialize followingArray field if missing
        setRider({ id: riderDoc.id, ...riderData });
        setIsFollowing(riderData.followersArray.includes(currentUser.uid));
        console.log('Rider data fetched:', riderData);
      } else {
        console.log('Rider document does not exist');
      }

      const postsQuery = query(collection(db, 'RideScout/Data/Posts'), where('userId', '==', userId));
      const postsSnapshot = await getDocs(postsQuery);
      const fetchedPosts = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(fetchedPosts);
      console.log('Posts fetched:', fetchedPosts);
    } catch (error) {
      console.error('Error fetching rider data:', error);
      Alert.alert('Error', 'There was an issue fetching the rider data. Please try again later.');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRiderData().then(() => setRefreshing(false));
  };

  const handleFollow = async () => {
    const riderRef = doc(db, 'RideScout/Data/Users', userId);
    const userRef = doc(db, 'RideScout/Data/Users', currentUser.uid);

    if (isFollowing) {
      await updateDoc(riderRef, {
        followersArray: arrayRemove(currentUser.uid),
      });
      await updateDoc(userRef, {
        followingArray: arrayRemove(userId),
      });
    } else {
      await updateDoc(riderRef, {
        followersArray: arrayUnion(currentUser.uid),
      });
      await updateDoc(userRef, {
        followingArray: arrayUnion(userId),
      });
      Alert.alert('Success', 'Account followed successfully');
    }

    setIsFollowing(!isFollowing);
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
      <Text style={styles.postContent}>{item.content}</Text>
      {item.imageUrls && item.imageUrls.length > 0 ? (
        item.imageUrls.map((url, index) => (
          <Image
            key={index}
            source={{ uri: url }}
            style={styles.image}
            onError={() => console.log('Image not available')}
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
        <TouchableOpacity onPress={() => navigation.navigate('CommentScreen', { postId: item.id })} style={styles.actionButton}>
          <Icon name="comment" size={20} color="#000" />
          <Text>{item.commentsCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!rider) {
    return <Text>Loading...</Text>;
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
