import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert, ScrollView, TouchableOpacity, Text, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import logo from '../assets/RideScout.jpg';

const CreateHog = ({ navigation }) => {
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [mileage, setMileage] = useState('');
  const [color, setColor] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gearAccessoryName, setGearAccessoryName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [showSubcategoryOptions, setShowSubcategoryOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map(asset => ({ uri: asset.uri }))]);
    }
  };

  const compressImage = async (uri) => {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipResult.uri;
  };

  const handleImagePress = (image) => {
    setSelectedImage(image);
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (user && category && price && description) {
      setUploading(true);
      const imageUrls = [];

      for (let image of images) {
        if (!image.uri) {
          console.error('Image URI is empty:', image);
          Alert.alert('Error', 'One of the selected images has an invalid URI. Please try again.');
          setUploading(false);
          return;
        }

        try {
          const compressedUri = await compressImage(image.uri);
          console.log(`Uploading image: ${compressedUri}`);
          const response = await fetch(compressedUri);
          const blob = await response.blob();
          const storageRef = ref(storage, `hogImages/${user.uid}/${Date.now()}.jpg`);
          await uploadBytes(storageRef, blob);
          const imageUrl = await getDownloadURL(storageRef);
          imageUrls.push(imageUrl);
          console.log(`Uploaded image URL: ${imageUrl}`);
        } catch (error) {
          console.error('Error uploading image:', error);
          Alert.alert('Error', 'There was an issue uploading an image. Please try again.');
          setUploading(false);
          return;
        }
      }

      const docRef = doc(db, 'hogs', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const newDoc = {
          userId: user.uid,
          category: category || '',
          subcategory: subcategory || '',
          make: make || '',
          model: model || '',
          mileage: mileage || '',
          color: color || '',
          price: price || 0,
          description: description || '',
          imageUrls: imageUrls || [],
          location: location || '',
          zipCode: zipCode || '',
          phone: phone || '',
          email: email || '',
          gearAccessoryName: gearAccessoryName || '',
          createdAt: serverTimestamp()
        };

        console.log('Creating document with data:', newDoc);

        try {
          await addDoc(collection(db, 'hogs'), newDoc);
          setUploading(false);
          Alert.alert('Success', 'Listing created successfully!');
          navigation.navigate('HogHub');
        } catch (error) {
          console.error('Error creating listing:', error);
          Alert.alert('Error', 'There was an issue creating the listing. Please try again.');
          setUploading(false);
        }
      } else {
        console.log('Document already exists');
        setUploading(false);
      }
    } else {
      Alert.alert('Error', 'Please fill in all required fields');
    }
  };

  const renderSubcategoryOptions = () => {
    if (category === 'Vehicle') {
      return (
        <>
          <Text>What type of vehicle?</Text>
          <View style={styles.optionsContainer}>
            {['Motorcycle', 'Moped', 'Car', 'Truck', 'Boat', 'Other'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.option, subcategory === option && styles.selectedOption]}
                onPress={() => setSubcategory(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {subcategory === 'Other' && (
            <TextInput
              style={styles.input}
              placeholder="Specify other vehicle type"
              value={subcategory}
              onChangeText={setSubcategory}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Make"
            value={make}
            onChangeText={setMake}
          />
          <TextInput
            style={styles.input}
            placeholder="Model"
            value={model}
            onChangeText={setModel}
          />
          <TextInput
            style={styles.input}
            placeholder="Mileage"
            value={mileage}
            onChangeText={setMileage}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Color"
            value={color}
            onChangeText={setColor}
          />
        </>
      );
    } else if (category === 'Trailer') {
      return (
        <>
          <Text>What type of trailer?</Text>
          <View style={styles.optionsContainer}>
            {['Utility Trailer', 'Boat Trailer', 'Car Trailer', 'Other'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.option, subcategory === option && styles.selectedOption]}
                onPress={() => setSubcategory(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {subcategory === 'Other' && (
            <TextInput
              style={styles.input}
              placeholder="Specify other trailer type"
              value={subcategory}
              onChangeText={setSubcategory}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Length"
            value={mileage}
            onChangeText={setMileage}
          />
          <TextInput
            style={styles.input}
            placeholder="Capacity"
            value={color}
            onChangeText={setColor}
          />
        </>
      );
    } else if (category === 'Gear' || category === 'Accessories') {
      return (
        <>
          <TextInput
            style={styles.input}
            placeholder="Gear/Accessory Name"
            value={gearAccessoryName}
            onChangeText={setGearAccessoryName}
          />
        </>
      );
    }
    return null;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Image source={logo} style={styles.logo} />
          </View>
          <Text>What are you selling?</Text>
          <View style={styles.optionsContainer}>
            {['Vehicle', 'Trailer', 'Gear', 'Accessories'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.option, category === option && styles.selectedOption]}
                onPress={() => {
                  setCategory(option);
                  setShowSubcategoryOptions(true);
                  setSubcategory('');
                }}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {showSubcategoryOptions && renderSubcategoryOptions()}
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
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
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Email (contact information for the seller)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Text>
            Note: <Text onPress={() => navigation.navigate('RideScoutDisclaimer')} style={styles.linkText}>This post is public, users will be able to view your profile and message you once this is posted.</Text>
          </Text>
          <Button title="Pick Images (up to 12)" onPress={pickImages} />
          <View style={styles.imageGrid}>
            {images.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => handleImagePress(image)}>
                <Image source={{ uri: image.uri }} style={styles.thumbnail} />
              </TouchableOpacity>
            ))}
          </View>
          <Modal visible={isModalVisible} transparent={true}>
            <View style={styles.modalBackground}>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.fullImageContainer}>
                <Image source={{ uri: selectedImage?.uri }} style={styles.fullImage} />
              </TouchableOpacity>
            </View>
          </Modal>
          <TouchableOpacity
            style={[styles.submitButton, uploading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={uploading}
          >
            <Text style={styles.submitButtonText}>Post Listing</Text>
          </TouchableOpacity>
          <Button title="Back" onPress={() => navigation.navigate('HogHub')} />
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  thumbnail: {
    width: 100,
    height: 100,
    margin: 5,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  option: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  selectedOption: {
    backgroundColor: '#aaa',
  },
  optionText: {
    color: '#000',
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  submitButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#777',
  },
  descriptionText: {
    marginBottom: 20,
    color: '#555',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImageContainer: {
    width: '90%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default CreateHog;
