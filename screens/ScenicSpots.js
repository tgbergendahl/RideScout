import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Button, Image, TextInput, ScrollView, Alert } from 'react-native';
import { getScenicSpots, createScenicSpot } from '../api/scenicSpots';
import { auth, storage } from '../firebase';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import logo from '../assets/Ride scout (2).jpg'; // Ensure the correct path to your logo image

const ScenicSpots = ({ navigation }) => {
  const [spots, setSpots] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [searchText, setSearchText] = useState('');
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getScenicSpots();
      setSpots(data);
      setFilteredSpots(data);
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
      setImage(result.assets[0].uri);
    }
  };

  const handleCreateSpot = async () => {
    try {
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
      Alert.alert('Success', 'Scenic spot created successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'There was an issue creating the scenic spot. Please try again.');
      console.error('Error creating scenic spot:', error);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = spots.filter((spot) =>
        spot.description.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSpots(filtered);
    } else {
      setFilteredSpots(spots);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by location"
        placeholderTextColor="#ccc"
        value={searchText}
        onChangeText={handleSearch}
      />
      {currentUser.email === 'jared@ridescout.net' && (
        <View style={styles.createSection}>
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
        data={filteredSpots}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.spotItem}>
            <Text>{item.description}</Text>
            {item.photo && <Image source={{ uri: item.photo }} style={styles.image} />}
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    color: '#000',
  },
  createSection: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  spotItem: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default ScenicSpots;
