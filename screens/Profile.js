// screens/Profile.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { auth, db, storage } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, doc, getDoc, query, where, onSnapshot, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [bio, setBio] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
          setProfilePic(userDoc.data().profilePic);
          setBio(userDoc.data().bio);
          setFollowing(userDoc.data().following || []);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkAdmin = async () => {
      try {
        const adminDoc = await getDoc(doc(db, 'admins', auth.currentUser.uid));
        if (adminDoc.exists()) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    const fetchUserPosts = () => {
      const q = query(collection(db, 'posts'), where('userId', '==', auth.currentUser.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const postsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setPosts(postsData);
      });

      return unsubscribe;
    };

    fetchUserData();
    checkAdmin();
    const unsubscribe = fetchUserPosts();

    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigation.navigate('LoginPage');
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

      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        profilePic: url,
      }, { merge: true });

      setProfilePic(url);
    }
  };

  const handleSaveBio = async () => {
    await setDoc(doc(db, 'users', auth.currentUser.uid), {
      bio,
    }, { merge: true });
  };

  const handleFollow = async (targetUserId) => {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      let followingList = userDoc.data().following || [];

      if (followingList.includes(targetUserId)) {
        followingList = followingList.filter(id => id !== targetUserId);
      } else {
        followingList.push(targetUserId);
      }

      await setDoc(userRef, { following: followingList }, { merge: true });
      setFollowing(followingList);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.post}>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.content}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No user data found</Text>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
    );
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
      {isAdmin && <Text style={styles.adminText}>Admin</Text>}
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.postsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
  adminText: {
    marginTop: 20,
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
  postsContainer: {
    paddingVertical: 10,
  },
  post: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default Profile;
