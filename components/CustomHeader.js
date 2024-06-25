import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const CustomHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/RideScout.jpg')} style={styles.logo} onError={(error) => console.error("Error loading logo image:", error)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  logoContainer: {
    position: 'absolute',
    top: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain'
  }
});

export default CustomHeader;
