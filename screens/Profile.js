// Profile.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, RefreshControl, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { getPosts, deletePost, likePost } from '../api/posts';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import logo from '../assets/RideScout.jpg';
import defaultProfile from '../assets/defaultProfile.png';

const Profile = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      fetchData();
    } else {
      console.error("No current user found");
    }
  }, [currentUser]);

  const fetchData = async () => {
    try {
      const data = await getPosts();
      setPosts(data.filter(post => post.userId === currentUser.uid));

      const userRef = doc(db, 'RideScout/Data/Users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
        console.log('User Data:', userDoc.data());
      } else {
        console.error("No user data found in Firestore");
        Alert.alert('Error', 'No user data found in Firestore');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'There was an issue fetching the data. Please try again later.');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  };

  const handleSignOut = () => {
    auth.signOut().then(() => navigation.replace('LoginPage'));
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      fetchData();
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'There was an issue deleting the post. Please try again later.');
    }
  };

  const handleLike = async (postId) => {
    try {
      await likePost(postId, currentUser.uid);
      fetchData();
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'There was an issue liking the post. Please try again later.');
    }
  };

  const handleComment = (postId) => {
    navigation.navigate('Comments', { postId });
  };

  const navigateToFollowers = () => {
    navigation.navigate('Followers', { userId: currentUser.uid });
  };

  const navigateToFollowing = () => {
    navigation.navigate('Following', { userId: currentUser.uid });
  };

  if (!currentUser) {
    return (
      <View>
        <Text>No user data available.</Text>
      </View>
    );
  }

  const getIconName = () => {
    switch (userData?.accountType) {
      case 'admin':
        return 'user-shield';
      case 'certifiedSeller':
        return 'certificate';
      case 'superCertifiedSeller':
        return 'star';
      default:
        return 'user';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      {userData && (
        <>
          <Image source={userData.profileImage ? { uri: userData.profileImage } : defaultProfile} style={styles.profileImage} />
          <Text style={styles.username}>{userData.username}</Text>
          {!userData.hideEmail && <Text style={styles.email}>{currentUser.email}</Text>}
          <Text style={styles.bio}>{userData.bio || 'This user has no bio'}</Text>
          <View style={styles.followContainer}>
            <TouchableOpacity onPress={navigateToFollowers}>
              <Text style={styles.followCount}>{userData.followers} Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToFollowing}>
              <Text style={styles.followCount}>{userData.following} Following</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile', { user: userData })} style={styles.editProfileButton}>
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('UpgradeAccount')} style={styles.upgradeAccountButton}>
        <Text style={styles.upgradeAccountButtonText}>Upgrade to Certified Seller</Text>
      </TouchableOpacity>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postItem}>
            <Text>{item.content}</Text>
            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
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
          </View>
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
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  email: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  followContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  followCount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  editProfileButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  editProfileButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  signOutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  upgradeAccountButton: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  upgradeAccountButtonText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  postItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
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

export default Profile;
