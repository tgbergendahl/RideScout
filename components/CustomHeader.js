// components/CustomHeader.js
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const CustomHeader = () => {
  return (
    <View style={styles.header}>
      <Image source={require('../assets/Ride scout (2).jpg')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 40,
  },
});

export default CustomHeader;
