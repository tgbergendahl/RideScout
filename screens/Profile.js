import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, RefreshControl, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { getPosts, deletePost, likePost } from '../api/posts';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import logo from '../assets/Ride_scout_2.jpg'; // Ensure the correct path to your logo image
import defaultProfile from '../assets/defaultProfile.png'; // Ensure the correct path to your default profile image

const Profile = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const currentUser = auth.currentUser;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getPosts();
      setPosts(data.filter(post => post.userId === currentUser.uid));
      const userRef = doc(db, 'RideScout/Data/Users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
        console.log('User Data:', userDoc.data());
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
      fetchData(); // Refresh the data after deletion
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'There was an issue deleting the post. Please try again later.');
    }
  };

  const handleLike = async (postId) => {
    try {
      await likePost(postId, currentUser.uid);
      fetchData(); // Refresh the data after liking a post
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'There was an issue liking the post. Please try again later.');
    }
  };

  const handleComment = (postId) => {
    navigation.navigate('Comments', { postId });
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
          <Image source={userData.profilePicture ? { uri: userData.profilePicture } : defaultProfile} style={styles.profileImage} />
          <Text style={styles.email}>{currentUser.email}</Text>
          <Text style={styles.followers}>Followers: {userData.followers}</Text>
          <Text style={styles.following}>Following: {userData.following}</Text>
          <Icon name={getIconName()} size={30} color="gold" />
        </>
      )}
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => {
          console.log('Navigating to EditProfile with user data:', userData);
          navigation.navigate('EditProfile', { user: userData });
        }} style={styles.editProfileButton}>
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
    width: 300,
    height: 150,
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
  email: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  followers: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  following: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  editProfileButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  editProfileButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
  },
  signOutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  upgradeAccountButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  upgradeAccountButtonText: {
    color: '#fff',
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
