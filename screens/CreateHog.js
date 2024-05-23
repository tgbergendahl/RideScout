import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CreateHog = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Vehicle');
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

    if (!result.cancelled) {
      setImages([...images, result.uri]);
    }
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (user && title && description && price && category) {
      setUploading(true);

      const imageUrls = [];
      for (const image of images) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `hogImages/${user.uid}/${Date.now()}`);
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }

      await addDoc(collection(db, 'RideScout/Data/Hogs'), {
        userId: user.uid,
        title,
        description,
        price,
        category,
        imageUrls,
        createdAt: serverTimestamp(),
      });

      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('Vehicle');
      setImages([]);
      setUploading(false);
      navigation.navigate('HogHub');
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryContainer}>
        <TouchableOpacity onPress={() => setCategory('Vehicle')}>
          <Text style={category === 'Vehicle' ? styles.selectedCategory : styles.category}>Vehicle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCategory('Accessory')}>
          <Text style={category === 'Accessory' ? styles.selectedCategory : styles.category}>Accessory</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCategory('Part')}>
          <Text style={category === 'Part' ? styles.selectedCategory : styles.category}>Part</Text>
        </TouchableOpacity>
      </View>
      <Button title="Upload Images" onPress={pickImage} />
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))}
      </View>
      <Button title="Create Listing" onPress={handleSubmit} disabled={uploading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  category: {
    marginRight: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectedCategory: {
    marginRight: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 5,
  },
});

export default CreateHog;
