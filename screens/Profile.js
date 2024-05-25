import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { getPosts } from '../api/posts';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import logo from '../assets/Ride scout (2).jpg'; // Ensure the correct path to your logo image

const Profile = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPosts();
      setPosts(data.filter(post => post.userId === currentUser.uid));
    };

    const fetchUserData = async () => {
      const userRef = doc(db, 'RideScout/Data/Users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    };

    fetchPosts();
    fetchUserData();
  }, []);

  if (!currentUser) {
    return <View><Text>No user data available.</Text></View>;
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

  const handleSignOut = () => {
    auth.signOut().then(() => navigation.replace('LoginPage'));
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      {userData && (
        <>
          <Image source={{ uri: userData.profilePicture }} style={styles.profileImage} />
          <Text>{currentUser.email}</Text>
          <Text>Followers: {userData.followers}</Text>
          <Text>Following: {userData.following}</Text>
          <Icon name={getIconName()} size={30} color="gold" />
        </>
      )}
      <TouchableOpacity onPress={() => navigation.navigate('EditProfile', { userId: currentUser.uid })}>
        <Text style={styles.editProfile}>Edit Profile</Text>
      </TouchableOpacity>
      <Button title="Sign Out" onPress={handleSignOut} />
      <TouchableOpacity onPress={() => navigation.navigate('UpgradeAccount')}>
        <Text style={styles.upgradeAccount}>Upgrade to Certified Seller</Text>
      </TouchableOpacity>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postItem}>
            <Text>{item.content}</Text>
            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  logo: {
    width: 100,
    height: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  editProfile: {
    color: 'blue',
    marginVertical: 10,
  },
  upgradeAccount: {
    color: 'blue',
    marginVertical: 10,
  },
  postItem: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
});

export default Profile;
