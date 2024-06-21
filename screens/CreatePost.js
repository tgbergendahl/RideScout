// screens/CreatePost.js
import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createPost } from '../api/posts';
import { getAuth, getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import logo from '../assets/RideScout.jpg'; // Ensure the correct path to your logo image

const CreatePost = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const currentUser = getAuth().currentUser;
  const storage = getStorage();

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (result.type === 'image') {
        setImages([...images, result.assets[0].uri]);
      } else if (result.type === 'video') {
        setVideo(result.assets[0].uri);
      }
    }
  };

  const handleSubmit = async () => {
    let imageUrls = [];
    let videoUrl = '';

    try {
      for (let image of images) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `postImages/${currentUser.uid}/${Date.now()}`);
        await uploadBytes(storageRef, blob);
        const imageUrl = await getDownloadURL(storageRef);
        imageUrls.push(imageUrl);
      }

      if (video) {
        const response = await fetch(video);
        const blob = await response.blob();
        const storageRef = ref(storage, `postVideos/${currentUser.uid}/${Date.now()}`);
        await uploadBytes(storageRef, blob);
        videoUrl = await getDownloadURL(storageRef);
      }

      const postData = {
        userId: currentUser.uid,
        content,
        imageUrls,
        videoUrl,
        likesCount: 0,
        commentsCount: 0,
      };

      await createPost(postData);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'There was an issue creating the post. Please try again.');
      console.error('Error creating post:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
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
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))}
          {video && <Video source={{ uri: video }} style={styles.video} />}
          <Button title="Post" onPress={handleSubmit} />
        </View>
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
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
});

export default CreatePost;
