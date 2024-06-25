import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert, ScrollView, Text, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MailComposer from 'expo-mail-composer';
import logo from '../assets/RideScout.jpg';

const CreateScenicSpot = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState(null);
  const [isBusiness, setIsBusiness] = useState(false);

  const handleChoosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!description || !location || !photo) {
      Alert.alert('Error', 'Please fill in all fields and choose a photo.');
      return;
    }

    const emailBody = `
      Description: ${description}
      Location: ${location}
      Business: ${isBusiness ? 'Yes' : 'No'}
    `;

    const options = {
      recipients: ['jared@ridescout.net'],
      subject: 'Scenic Spot Inquiry',
      body: emailBody,
      attachments: [photo.uri],
    };

    try {
      await MailComposer.composeAsync(options);
      Alert.alert('Success', 'Scenic spot inquiry sent successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error sending email:', error);
      Alert.alert('Error', 'There was an issue sending the email. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      <Text style={styles.inquiryText}>
        Submit this form to post your Scenic Spot
      </Text>
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
      <View style={styles.businessContainer}>
        <Text style={styles.businessText}>Is this a business?</Text>
        <Switch
          value={isBusiness}
          onValueChange={setIsBusiness}
        />
      </View>
      <Button title="Choose Photo" onPress={handleChoosePhoto} />
      {photo && <Image source={{ uri: photo.uri }} style={styles.image} />}
      <Button title="Submit Scenic Spot" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  inquiryText: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  businessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  businessText: {
    fontSize: 16,
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
});

export default CreateScenicSpot;
