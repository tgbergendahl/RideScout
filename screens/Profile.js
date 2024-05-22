// screens/Profile.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { auth, db, storage } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, query, where, onSnapshot, setDoc, getDocs } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.uid);
        const unsubscribePosts = fetchUserPosts(currentUser.uid);
        return () => {
          unsubscribePosts();
        };
      } else {
        setLoading(false);
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser(userData);
        setProfilePic(userData.profilePic || null);
        setBio(userData.bio || '');
        setFollowing(userData.following || []);

        // Fetch followers count
        const followersQuery = query(collection(db, 'users'), where('following', 'array-contains', uid));
        const followersSnapshot = await getDocs(followersQuery);
        setFollowersCount(followersSnapshot.size);
      } else {
        setUser({}); // Empty user object if no data exists
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = (uid) => {
    const q = query(collection(db, 'posts'), where('userID', '==', uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPosts(postsData);
    });

    return unsubscribe;
  };

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

  if (!auth.currentUser) {
    return (
      <View style={styles.container}>
        <Text>No user is logged in</Text>
        <Button title="Go to Login" onPress={() => navigation.navigate('LoginPage')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text>No Profile Picture</Text>
          </View>
        )}
        <Text style={styles.username}>{auth.currentUser.email}</Text>
        <Text>{followersCount} followers</Text>
        {isEditing ? (
          <>
            <TextInput
              style={styles.bio}
              value={bio}
              onChangeText={setBio}
              placeholder="Add a bio"
            />
            <Button title="Save Bio" onPress={handleSaveBio} />
            <Button title="Upload Profile Picture" onPress={handleProfilePicUpload} />
          </>
        ) : (
          <Text style={styles.bioText}>{bio || 'No bio available'}</Text>
        )}
        <Button title={isEditing ? "View Profile" : "Edit Profile"} onPress={() => setIsEditing(!isEditing)} />
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.postsContainer}
        ListEmptyComponent={<Text>No posts yet</Text>}
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
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
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
  bioText: {
    marginTop: 10,
    fontSize: 16,
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
