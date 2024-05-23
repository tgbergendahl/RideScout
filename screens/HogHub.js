// screens/HogHub.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { auth, db, storage } from '../firebase';
import { collection, addDoc, onSnapshot, query, where, orderBy, doc, deleteDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const HogHub = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [images, setImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'hoghub'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true, // Allow multiple images
    });

    if (!result.cancelled) {
      const selectedImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...selectedImages]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !price || !description || !location || !zipCode || images.length === 0) {
      alert('Please fill in all fields and add at least one image');
      return;
    }

    const imageUrls = [];
    for (let image of images) {
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, `hoghub/${auth.currentUser.uid}/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      imageUrls.push(url);
    }

    await addDoc(collection(db, 'hoghub'), {
      userID: auth.currentUser.uid,
      title,
      price,
      description,
      location,
      zipCode,
      images: imageUrls,
      createdAt: new Date(),
    });

    setTitle('');
    setPrice('');
    setDescription('');
    setLocation('');
    setZipCode('');
    setImages([]);
  };

  const handleDelete = async (postId) => {
    await deleteDoc(doc(db, 'hoghub', postId));
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>Price: {item.price}</Text>
      <Text>{item.description}</Text>
      <Text>Location: {item.location}, {item.zipCode}</Text>
      <FlatList
        data={item.images}
        horizontal
        renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button title="Delete Post" onPress={() => handleDelete(item.id)} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Zip Code"
        value={zipCode}
        onChangeText={setZipCode}
      />
      {images.length > 0 && (
        <FlatList
          data={images}
          horizontal
          renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      <Button title="Pick Images" onPress={handleImagePick} />
      <Button title="Submit" onPress={handleSubmit} />
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>No posts yet</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  item: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 8,
  },
});

export default HogHub;
