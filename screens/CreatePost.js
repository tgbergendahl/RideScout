// screens/CreatePost.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, Image } from 'react-native';
import { auth, db, storage } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const CreatePostScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);

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
    if (!title || !content || images.length === 0) {
      alert('Please fill in all fields and add at least one image');
      return;
    }

    const imageUrls = [];
    for (let image of images) {
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, `posts/${auth.currentUser.uid}/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      imageUrls.push(url);
    }

    await addDoc(collection(db, 'posts'), {
      userID: auth.currentUser.uid,
      title,
      content,
      images: imageUrls,
      createdAt: new Date(),
    });

    setTitle('');
    setContent('');
    setImages([]);
    navigation.navigate('Home');
  };

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
        placeholder="Content"
        value={content}
        onChangeText={setContent}
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
  image: {
    width: 100,
    height: 100,
    marginRight: 8,
  },
});

export default CreatePostScreen;
