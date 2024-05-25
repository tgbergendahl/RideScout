import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { createScenicSpot } from '../api/scenicSpots';

const CreateScenicSpot = () => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState(null);
  const navigation = useNavigation();

  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        setPhoto(response.assets[0]);
      }
    });
  };

  const handleSubmit = async () => {
    try {
      await createScenicSpot({ description, location, photo });
      navigation.goBack();
    } catch (error) {
      console.error('Error creating scenic spot:', error);
    }
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
