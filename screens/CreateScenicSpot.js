// screens/CreateScenicSpot.js
import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createScenicSpot } from '../api/scenicSpots';
import { getAuth, getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CreateScenicSpot = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
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
        const storageRef = ref(storage, `scenicSpotImages/${currentUser.uid}/${Date.now()}`);
        await uploadBytes(storageRef, blob);
        const imageUrl = await getDownloadURL(storageRef);
        imageUrls.push(imageUrl);
      }

      if (video) {
        const response = await fetch(video);
        const blob = await response.blob();
        const storageRef = ref(storage, `scenicSpotVideos/${currentUser.uid}/${Date.now()}`);
        await uploadBytes(storageRef, blob);
        videoUrl = await getDownloadURL(storageRef);
      }

      const spotData = {
        userId: currentUser.uid,
        description,
        location,
        imageUrls,
        videoUrl,
        createdAt: serverTimestamp(),
      };

      await createScenicSpot(spotData);
      Alert.alert('Success', 'Scenic spot created successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'There was an issue creating the scenic spot. Please try again.');
      console.error('Error creating scenic spot:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <Button title="Pick an image or video from camera roll" onPress={pickMedia} />
      {images.map((image, index) => (
        <Image key={index} source={{ uri: image }} style={styles.image} />
      ))}
      {video && <Video source={{ uri: video }} style={styles.video} />}
      <Button title="Create Scenic Spot" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
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

export default CreateScenicSpot;
