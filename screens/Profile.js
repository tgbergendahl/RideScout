import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/styles';

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState('');
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [editing, setEditing] = useState(false);
  const { isCertifiedSeller, isSuperCertifiedSeller } = useAuth();

  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

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
      setEditing(false);
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
      {editing ? (
        <>
          <TextInput
            style={styles.input}
            value={bio}
            onChangeText={setBio}
            placeholder="Enter your bio"
          />
          <Button title="Save Bio" onPress={handleSaveBio} />
        </>
      ) : (
        <>
          <Text style={styles.bio}>{bio}</Text>
          <Button title="Edit Profile" onPress={() => setEditing(true)} />
        </>
      )}
      <Button title="Sign Out" onPress={handleSignOut} />
      {isCertifiedSeller || isSuperCertifiedSeller ? (
        <Text style={styles.sellerBadge}>
          {isCertifiedSeller ? 'Certified Seller' : 'Super Certified Seller'}
        </Text>
      ) : (
        <Button title="Upgrade to Certified Seller" onPress={() => navigation.navigate('UpgradeAccount')} />
      )}
    </View>
  );
};

export default Profile;
