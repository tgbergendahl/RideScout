import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUserPosts } from '../api/posts';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import logo from '../assets/RideScout.jpg'; // Corrected path to your logo image

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, 'RideScout/Data/Users', currentUser.uid));
      setUser(userDoc.data());
    };

    const fetchPosts = async () => {
      const userPosts = await getUserPosts(currentUser.uid);
      setPosts(userPosts);
    };

    fetchUser();
    fetchPosts();
  }, [currentUser.uid]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.replace('LoginPage');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      {user && (
        <>
          <Text style={styles.email}>{user.email}</Text>
          <Button title="Sign Out" onPress={handleSignOut} style={styles.signOutButton} />
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
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
  email: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  postItem: {
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
});

export default Profile;
