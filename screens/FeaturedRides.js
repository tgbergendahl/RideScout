// screens/FeaturedRides.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const FeaturedRides = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.media} />
        <Text style={styles.text}>Peep this video of my red bike during a red sunset!! #reddynornot</Text>
        <Text style={styles.subText}>3 million riders like this</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.media} />
        <Text style={styles.text}>So are you guys posting bikes on hoghub?</Text>
        <Text style={styles.subText}>1 million comments</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.media} />
        <Text style={styles.text}>Sunrise view from my Kawasaki at 4am #homeless</Text>
        <Text style={styles.subText}>1 million people shared this</Text>
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
  card: {
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
});

export default FeaturedRides;
