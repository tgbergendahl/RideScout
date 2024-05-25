// screens/ContactSeller.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContactSeller = ({ route }) => {
  const { listingId } = route.params;

  return (
    <View style={styles.container}>
      <Text>Contact Seller for listing ID: {listingId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

export default ContactSeller;
