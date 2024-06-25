import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, storage, db } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import logo from '../assets/RideScout.jpg'; // Ensure the correct path to your logo image

const CreatePost = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState([]);
  const currentUser = auth.currentUser;

  const pickMedia = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setMedia([...media, ...result.assets.map(asset => asset.uri)]);
      }
    } catch (error) {
      console.error("Error picking media: ", error);
      Alert.alert("Error", "There was an issue picking the media. Please try again.");
    }
  };

  const handleSubmit = async () => {
    const mediaUrls = [];
    try {
      for (let uri of media) {
        const response = await fetch(uri);
        if (!response.ok) {
          throw new Error(`Error fetching image: ${response.statusText}`);
        }

        const blob = await response.blob();
        const fileExtension = uri.split('.').pop();
        const storageRef = ref(storage, `postMedia/${currentUser.uid}/${Date.now()}.${fileExtension}`);
        await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageRef);
        mediaUrls.push(downloadUrl);
      }

      const postData = {
        userId: currentUser.uid,
        content,
        mediaUrls,
        createdAt: serverTimestamp(),
        likesCount: 0,
        commentsCount: 0,
        likes: [],
        comments: []
      };

      await addDoc(collection(db, 'RideScout/Data/Posts'), postData);
      navigation.goBack();
    } catch (error) {
      console.error("Error creating post: ", error);
      Alert.alert('Error', `There was an issue creating the post. ${error.message}`);
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
          <Button title="Pick an image or video from camera roll" onPress={pickMedia} />
          <View style={styles.mediaContainer}>
            {media.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.image} />
            ))}
          </View>
          <Button title="Post" onPress={handleSubmit} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  logo: {
    width: 300,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    textAlignVertical: 'top',
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  image: {
    width: '48%',
    height: 200,
    marginBottom: 20,
  },
});

export default CreatePost;
