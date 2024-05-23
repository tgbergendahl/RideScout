import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const ContactSellerScreen = ({ route }) => {
  const { listingId } = route.params;
  const [message, setMessage] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');

  const auth = getAuth();
  const db = getFirestore();

  useState(() => {
    const fetchSellerEmail = async () => {
      const listingDoc = await getDoc(doc(db, 'RideScout/Data/Hogs', listingId));
      const listingData = listingDoc.data();
      const sellerDoc = await getDoc(doc(db, 'RideScout/Data/Users', listingData.userId));
      setSellerEmail(sellerDoc.data().email);
    };

    fetchSellerEmail();
  }, [listingId]);

  const handleSend = () => {
    if (message) {
      // Logic to send message to seller, e.g., email or in-app messaging
      alert(`Message sent to ${sellerEmail}`);
    } else {
      alert('Please enter a message.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Seller</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your message"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <Button title="Send Message" onPress={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default ContactSellerScreen;
