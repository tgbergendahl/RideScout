import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const CustomHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/Ride scout (2).jpg')} style={styles.logo} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 150, // Increased height to accommodate larger logo
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    position: 'absolute',
    top: 10, // Adjust as needed to position logo correctly
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200, // Adjusted size
    height: 100, // Adjusted size
    resizeMode: 'contain',
  },
});

export default CustomHeader;
