import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import logo from '../assets/Ride scout (2).jpg'; // Ensure the correct path to your logo image

const CreateHog = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (user && title && category && price && description) {
      setUploading(true);
      const imageUrls = [];

      for (let image of images) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `hogImages/${user.uid}/${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);
        const imageUrl = await getDownloadURL(storageRef);
        imageUrls.push(imageUrl);
      }

      await addDoc(collection(db, 'RideScout/Data/Hogs'), {
        userId: user.uid,
        title,
        category,
        price,
        description,
        imageUrls,
        createdAt: serverTimestamp(),
      });

      setUploading(false);
      Alert.alert('Success', 'Listing created successfully!');
      navigation.navigate('HogHub');
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search makes, models, location etc."
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Pick Images" onPress={pickImage} />
      {images.map((image, index) => (
        <Image key={index} source={{ uri: image }} style={styles.image} />
      ))}
      <Button title="Create Listing" onPress={handleSubmit} disabled={uploading} />
      <Button title="Back" onPress={() => navigation.navigate('HogHub')} />
    </ScrollView>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
});

export default CreateHog;
