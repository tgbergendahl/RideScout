// screens/Profile.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, TextInput, FlatList } from 'react-native';
import { auth, db, storage } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [bio, setBio] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setUser(userDoc.data());
        setProfilePic(userDoc.data().profilePic);
        setBio(userDoc.data().bio);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const q = query(collection(db, 'posts'), where('userID', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const userPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(userPosts);
    };

    fetchUserPosts();
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigation.navigate('Login');
    });
  };

  const handleProfilePicUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      const blob = await (await fetch(result.uri)).blob();
      const storageRef = ref(storage, `profilePics/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);

      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        profilePic: url,
      });

      setProfilePic(url);
    }
  };

  const handleSaveBio = async () => {
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      bio,
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.post}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.content}</Text>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
    </View>
  );

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.avatar} />
        ) : (
          <Button title="Upload Profile Picture" onPress={handleProfilePicUpload} />
        )}
        <Text style={styles.username}>{auth.currentUser.email}</Text>
        <TextInput
          style={styles.bio}
          value={bio}
          onChangeText={setBio}
          placeholder="Add a bio"
        />
        <Button title="Save Bio" onPress={handleSaveBio} />
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => <Text>No posts yet</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  profile: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
  },
  username: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  bio: {
    marginTop: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    width: '80%',
  },
  post: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 8,
  },
});

export default ProfileScreen;
