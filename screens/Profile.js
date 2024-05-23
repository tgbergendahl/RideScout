import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState('');
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, 'RideScout/Data/Users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setBio(userData.bio || '');
          setFollowers(userData.followers || 0);
          setFollowing(userData.following || 0);
          if (userData.profileImage) {
            setProfileImage(userData.profileImage);
          }
        }
      }
    };
    fetchUserData();
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigation.navigate('LoginPage');
    }).catch((error) => {
      console.error('Error signing out: ', error);
    });
  };

  const handleSaveBio = async () => {
    if (user) {
      await updateDoc(doc(db, 'RideScout/Data/Users', user.uid), {
        bio: bio,
      });
      alert('Bio updated!');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const response = await fetch(result.uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      setProfileImage(url);
      await updateDoc(doc(db, 'RideScout/Data/Users', user.uid), {
        profileImage: url,
      });
      alert('Profile image updated!');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image source={profileImage ? { uri: profileImage } : require('../assets/defaultProfile.png')} style={styles.profileImage} />
      </TouchableOpacity>
      <Text style={styles.email}>{user?.email}</Text>
      <Text style={styles.followerCount}>Followers: {followers}</Text>
      <Text style={styles.followingCount}>Following: {following}</Text>
      <TextInput
        style={styles.bioInput}
        value={bio}
        onChangeText={setBio}
        placeholder="Enter your bio"
      />
      <Button title="Save Bio" onPress={handleSaveBio} />
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  email: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  followerCount: {
    fontSize: 16,
    marginBottom: 10,
  },
  followingCount: {
    fontSize: 16,
    marginBottom: 10,
  },
  bioInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Profile;
