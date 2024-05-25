import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput } from 'react-native';
import { getScenicSpots, createScenicSpot } from '../api/scenicSpots';
import { auth, storage } from '../firebase';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import logo from '../assets/Ride scout (2).jpg'; // Ensure the correct path to your logo image

const ScenicSpots = ({ navigation }) => {
  const [spots, setSpots] = useState([]);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getScenicSpots();
      setSpots(data);
    };

    fetchData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleCreateSpot = async () => {
    let imageUrl = '';
    if (image) {
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, `scenicSpotImages/${currentUser.uid}/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      imageUrl = await getDownloadURL(storageRef);
    }

    const spotData = {
      userId: currentUser.uid,
      description,
      imageUrl,
    };

    await createScenicSpot(spotData);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      {currentUser.email === 'jared@ridescout.net' && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <Button title="Pick an image from camera roll" onPress={pickImage} />
          {image && <Image source={{ uri: image }} style={styles.image} />}
          <Button title="Create Scenic Spot" onPress={handleCreateSpot} />
        </View>
      )}
      <FlatList
        data={spots}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.spotItem}>
            <Text>{item.description}</Text>
            {item.photo && <Image source={{ uri: item.photo }} style={styles.image} />}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  logo: {
    width: 100,
    height: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  spotItem: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
});

export default ScenicSpots;
