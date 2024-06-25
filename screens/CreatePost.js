import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, storage, db } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import logo from '../assets/RideScout.jpg'; // Ensure the correct path to your logo image

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
    let imageUrls = [];
    if (image) {
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, `postImages/${currentUser.uid}/${Date.now()}.jpg`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      imageUrls.push(downloadURL);
    }

    const postData = {
      userId: currentUser.uid,
      content,
      imageUrls,
      createdAt: serverTimestamp(),
      likesCount: 0,
      commentsCount: 0,
      likes: [],
      comments: []
    };

    try {
      await addDoc(collection(db, 'RideScout/Data/Posts'), postData);
      navigation.goBack();
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert('Error', 'There was an issue creating the post. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.innerContainer}>
          <View style={styles.header}>
            <Image source={logo} style={styles.logo} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="What's on your mind?"
            value={content}
            onChangeText={setContent}
            multiline
          />
          <Button title="Pick an image from camera roll" onPress={pickImage} />
          {image && <Image source={{ uri: image }} style={styles.image} />}
          <Button title="Post" onPress={handleSubmit} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  innerContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  header: {
    width: '100%',
    height: 80, // Adjusted height to accommodate larger logo
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 10, // Added padding for better spacing
    marginBottom: 20
  },
  logo: {
    width: 200, // Adjusted size
    height: 100, // Adjusted size
    resizeMode: 'contain' // Ensures the logo maintains its aspect ratio
  },
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    textAlignVertical: 'top'
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10
  }
});

export default CreatePost;
