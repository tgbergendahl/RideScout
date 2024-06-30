import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, Switch, Text } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageAsync } from '../utils/uploadImageAsync';

const EditProfile = ({ navigation, route }) => {
  const { user } = route.params;
  const [bio, setBio] = useState(user.bio || '');
  const [profileImage, setProfileImage] = useState(user.profileImage || '');
  const [username, setUsername] = useState(user.username || '');
  const [hideEmail, setHideEmail] = useState(user.hideEmail || false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const userRef = doc(db, 'RideScout/Data/Users', auth.currentUser.uid);
      await updateDoc(userRef, {
        bio,
        profileImage,
        username,
        hideEmail,
      });
      Alert.alert('Success', 'Profile updated successfully.');
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'There was an issue updating your profile. Please try again later.');
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('ImagePicker result:', result); // Debugging log

      if (!result.canceled) {
        console.log('Image selected:', result.assets[0].uri); // Ensure the URI is captured correctly
        setImageUploading(true);
        const uploadedUrl = await uploadImageAsync(result.assets[0].uri);
        console.log('Image uploaded to:', uploadedUrl); // Debugging log
        setProfileImage(uploadedUrl);
      } else {
        console.log('Image selection cancelled');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'There was an issue selecting the image. Please try again later.');
    } finally {
      setImageUploading(false);
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
      <TouchableOpacity onPress={pickImage} disabled={imageUploading}>
        <Image source={profileImage ? { uri: profileImage } : require('../assets/defaultProfile.png')} style={styles.profileImage} />
        {imageUploading && <Text>Uploading...</Text>}
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
