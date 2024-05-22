// screens/CreatePost.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image } from 'react-native';
import { auth, db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const CreatePost = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const blob = await (await fetch(result.uri)).blob();
      const storageRef = ref(storage, `posts/${new Date().toISOString()}`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      setImage(url);
    }
  };

  const handleSubmit = async () => {
    await addDoc(collection(db, 'posts'), {
      userId: auth.currentUser.uid,
      title,
      content,
      image,
      createdAt: new Date(),
    });

    navigation.goBack();
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
        multiline
      />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Upload Image" onPress={handleImageUpload} />
      <Button title="Create Post" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 12,
  },
});

export default CreatePost;
