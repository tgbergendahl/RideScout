// screens/HogHub.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const HogHub = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>HogHub Screen</Text>
      <Button
        title="Create Hog"
        onPress={() => navigation.navigate('CreateHog')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HogHub;
