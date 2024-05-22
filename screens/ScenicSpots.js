// screens/ScenicSpots.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TextInput, Button } from 'react-native';
import { auth, db, storage } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const ScenicSpots = () => {
  const [spots, setSpots] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'scenicspots'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const spotsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSpots(spotsData);
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
    if (auth.currentUser.email !== 'jared@ridescout.net') {
      alert('Only admin can create posts');
      return;
    }

    if (!title || !description) {
      alert('Please fill in all fields');
      return;
    }

    let imageUrl = '';
    if (image) {
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, `scenicspots/${auth.currentUser.uid}/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      imageUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, 'scenicspots'), {
      title,
      description,
      image: imageUrl,
      createdAt: new Date(),
    });

    setTitle('');
    setDescription('');
    setImage(null);
  };

  const renderItem = ({ item }) => (
    <View style={styles.spot}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.description}</Text>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={spots}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      {auth.currentUser.email === 'jared@ridescout.net' && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.description]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          {image && <Image source={{ uri: image }} style={styles.image} />}
          <Button title="Pick an image" onPress={handleImagePick} />
          <Button title="Create Post" onPress={handleSubmit} />
        </View>
      )}
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
  description: {
    height: 80,
  },
  spot: {
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

export default ScenicSpots;
