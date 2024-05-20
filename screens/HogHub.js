// screens/HogHub.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';

const HogHub = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <Button
        title="Create Hog"
        onPress={() => navigation.navigate('CreateHog')}
      />
      <View style={styles.hog}>
        <View style={styles.media} />
        <Text style={styles.text}>CFMOTO 500cc</Text>
        <Text style={styles.subText}>Sponsored</Text>
      </View>
      <View style={styles.hog}>
        <View style={styles.media} />
        <Text style={styles.text}>Moped $10 or best</Text>
      </View>
      <View style={styles.hog}>
        <View style={styles.media} />
        <Text style={styles.text}>Harley $13500</Text>
      </View>
      <View style={styles.hog}>
        <View style={styles.media} />
        <Text style={styles.text}>Riding Shirt $45</Text>
      </View>
      <View style={styles.hog}>
        <View style={styles.media} />
        <Text style={styles.text}>Yamaha — trade</Text>
      </View>
      <View style={styles.hog}>
        <View style={styles.media} />
        <Text style={styles.text}>'98 Suzuki TU $2000</Text>
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
  hog: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  media: {
    height: 100,
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

export default HogHub;
