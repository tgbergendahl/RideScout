import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Image, TouchableOpacity, Text } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import logo from '../assets/RideScout.jpg'; // Adjust the path if necessary

const SignupPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'RideScout/Data/Users', user.uid), {
        email,
        username,
        bio: '',
        followers: 0,
        following: 0,
        profileImage: '',
      });
      navigation.replace('MainTabs');
    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Error', 'There was an issue signing up. Please try again later.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Image source={logo} style={styles.logo} />
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
          <Button title="Sign Up" onPress={handleSignup} />
          <Button
            title="Already have an account? Log In"
            onPress={() => navigation.navigate('LoginPage')}
          />
          <TouchableOpacity onPress={() => navigation.navigate('RideScoutDisclaimer')}>
            <Text style={styles.disclaimerLink}>View Disclaimer and Guidelines</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  disclaimerLink: {
    color: '#007BFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});

export default SignupPage;
