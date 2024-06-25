import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import logo from '../assets/RideScout.jpg'; // Adjust the path if necessary

const LoginPage = ({ navigation }) => {
  const [identifier, setIdentifier] = useState(''); // Username or email
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      let email = identifier;
      if (!identifier.includes('@')) {
        const q = query(collection(db, 'RideScout/Data/Users'), where('username', '==', identifier));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          email = userDoc.data().email;
        } else {
          throw new Error('No user found with that username');
        }
      }
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('MainTabs');
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', 'There was an issue logging in. Please try again later.');
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
            value={identifier}
            onChangeText={setIdentifier}
            placeholder="Username or Email"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
          <Button title="Login" onPress={handleLogin} />
          <Button
            title="Don't have an account? Sign Up"
            onPress={() => navigation.navigate('SignupPage')}
          />
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
});

export default LoginPage;
