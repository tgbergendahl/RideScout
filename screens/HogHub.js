// screens/HogHub.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Image } from 'react-native';
import { db, storage, auth } from '../firebase';
import { addDoc, collection, query, onSnapshot, where } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const HogHub = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'hogs'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(itemsData);
      setFilteredItems(itemsData);
    });

    return unsubscribe;
  }, []);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !price || !location || !zipCode) {
      alert('Please fill in all fields');
      return;
    }

    let imageUrl = '';
    if (image) {
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, `hogs/${auth.currentUser.uid}/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      imageUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, 'hogs'), {
      userID: auth.currentUser.uid,
      title,
      description,
      price,
      location,
      zipCode,
      image: imageUrl,
      createdAt: new Date(),
    });

    setTitle('');
    setDescription('');
    setPrice('');
    setLocation('');
    setZipCode('');
    setImage(null);
  };

  useEffect(() => {
    if (search) {
      setFilteredItems(items.filter(item => item.title.toLowerCase().includes(search.toLowerCase())));
    } else {
      setFilteredItems(items);
    }
  }, [search, items]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>Price: {item.price}</Text>
      <Text>Location: {item.location}</Text>
      <Text>Zip Code: {item.zipCode}</Text>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
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
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
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
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Pick an image" onPress={handleImagePick} />
      <Button title="Post Hog" onPress={handleSubmit} />
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
    width: '100%',
    height: 200,
    marginTop: 8,
  },
});

export default HogHub;
