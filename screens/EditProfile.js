import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, Switch, Text } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageAsync } from '../utils/uploadImage';

const EditProfile = ({ navigation, route }) => {
  const { user } = route.params;
  console.log('EditProfile route.params.user:', user);

  const [bio, setBio] = useState(user?.bio || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [username, setUsername] = useState(user?.username || '');
  const [hideEmail, setHideEmail] = useState(user?.hideEmail || false);

  const handleUpdateProfile = async () => {
    console.log('Updating profile...');
    try {
      const userRef = doc(db, 'RideScout/Data/Users', auth.currentUser.uid);
      await updateDoc(userRef, {
        bio,
        profileImage,
        username,
        hideEmail,
      });
      console.log('Profile updated successfully');
      Alert.alert('Success', 'Profile updated successfully.');
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'There was an issue updating your profile. Please try again later.');
    }
  };

  const pickImage = async () => {
    console.log('Picking image...');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const uploadedUrl = await uploadImageAsync(result.uri);
      console.log('Image uploaded:', uploadedUrl);
      setProfileImage(uploadedUrl);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
      />
      <TouchableOpacity onPress={pickImage}>
        <Image source={profileImage ? { uri: profileImage } : require('../assets/defaultProfile.png')} style={styles.profileImage} />
      </TouchableOpacity>
      <View style={styles.switchContainer}>
        <Text>Hide Email</Text>
        <Switch value={hideEmail} onValueChange={setHideEmail} />
      </View>
      <Button title="Save" onPress={handleUpdateProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default EditProfile;
