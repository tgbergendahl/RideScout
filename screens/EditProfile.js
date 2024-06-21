// screens/EditProfile.js
import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updateProfile } from '../api/users';
import * as ImagePicker from 'expo-image-picker';
import defaultProfile from '../assets/defaultProfile.png'; // Ensure the correct path to your default profile image

const EditProfile = ({ route }) => {
  const user = route.params?.user || {};
  const [bio, setBio] = useState(user.bio || '');
  const [profileImage, setProfileImage] = useState(user.profileImage || null);
  const navigation = useNavigation();

  const handleSave = async () => {
    try {
      const updatedData = { bio };
      if (profileImage) {
        updatedData.profileImage = profileImage;
      }
      await updateProfile(user.id, updatedData);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'There was an issue updating your profile. Please try again.');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={profileImage ? { uri: profileImage } : defaultProfile}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="Edit your bio"
        style={styles.input}
      />
      <Button title="Finish Editing" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default EditProfile;
