// screens/CreateScenicSpot.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CreateScenicSpot = () => {
  return (
    <View style={styles.container}>
      <Text>Create a Scenic Spot</Text>
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

export default CreateScenicSpot;
