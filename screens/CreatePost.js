// screens/CreatePost.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import { auth, db, storage } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const CreatePost = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

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
    if (!title || !content) {
      alert('Please fill in all fields');
      return;
    }

    let imageUrl = '';
    if (image) {
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, `posts/${auth.currentUser.uid}/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      imageUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, 'posts'), {
      userID: auth.currentUser.uid,
      title,
      content,
      image: imageUrl,
      createdAt: new Date(),
    });

    setTitle('');
    setContent('');
    setImage(null);

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
        style={[styles.input, styles.content]}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
      />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Pick an image" onPress={handleImagePick} />
      <Button title="Create Post" onPress={handleSubmit} />
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
  content: {
    height: 100,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 12,
  },
});

export default CreatePost;
