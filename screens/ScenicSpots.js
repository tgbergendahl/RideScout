// screens/ScenicSpots.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ScenicSpots = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.spot}>
        <View style={styles.media} />
        <Text style={styles.text}>Vanilla Bean Cafe — Pomfret, CT</Text>
        <Text style={styles.subText}>38 riders liked this</Text>
        <Text style={styles.comment}>Comment</Text>
      </View>
      <View style={styles.spot}>
        <View style={styles.media} />
        <Text style={styles.text}>American Eagle Bar & Saloon — Willington, CT</Text>
        <Text style={styles.subText}>12 riders liked this</Text>
        <Text style={styles.comment}>Comment</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  spot: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  media: {
    height: 150,
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
  subText: {
    marginTop: 5,
    fontSize: 14,
    color: 'gray',
  },
  comment: {
    marginTop: 10,
    fontSize: 14,
    color: 'blue',
  },
});

export default ScenicSpots;
