import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createPost } from '../api/posts';
import { auth, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import logo from '../assets/Ride scout (2).jpg'; // Ensure the correct path to your logo image

const CreatePost = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const currentUser = auth.currentUser;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Update this line to access uri correctly
    }
  };

  const handleSubmit = async () => {
    let imageUrl = '';
    if (image) {
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, `postImages/${currentUser.uid}/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      imageUrl = await getDownloadURL(storageRef);
    }

    const postData = {
      userId: currentUser.uid,
      content,
      imageUrl,
      likesCount: 0,
      commentsCount: 0,
    };

    await createPost(postData);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        value={content}
        onChangeText={setContent}
      />
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Post" onPress={handleSubmit} />
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
    height: 80, // Increased height to accommodate larger logo
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 10, // Added padding for better spacing
  },
  logo: {
    width: 200, // Adjusted size
    height: 500, // Adjusted size
    resizeMode: 'contain', // Ensures the logo maintains its aspect ratio
  },
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
});

export default CreatePost;
