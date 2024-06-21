import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert, ScrollView, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createScenicSpot } from '../api/scenicSpots';
import { auth } from '../firebaseConfig';
import logo from '../assets/RideScout.jpg';

const CreateScenicSpot = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState(null);
  const currentUser = auth.currentUser;

  const handleChoosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (currentUser.email !== 'jared@ridescout.net') {
      Alert.alert('Unauthorized', 'Only Jared can create a scenic spot.');
      return;
    }

    try {
      await createScenicSpot({ description, location, photo });
      navigation.goBack();
    } catch (error) {
      console.error('Error creating scenic spot:', error);
      Alert.alert('Error', 'There was an issue creating the scenic spot. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      <Text style={styles.inquiryText}>
        If you have a business you'd like featured, email inquiries to thomas@ridescout.net
      </Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        style={styles.input}
      />
      <TextInput
        value={location}
        onChangeText={setLocation}
        placeholder="Location"
        style={styles.input}
      />
      <Button title="Choose Photo" onPress={handleChoosePhoto} />
      {photo && <Image source={{ uri: photo.uri }} style={styles.image} />}
      <Button title="Create Scenic Spot" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  inquiryText: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
});

export default CreateScenicSpot;
