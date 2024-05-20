// screens/Home.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button } from 'react-native';

const Home = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search"
      />
      <Button
        title="Create Post"
        onPress={() => navigation.navigate('CreatePost')}
      />
      <View style={styles.post}>
        <View style={styles.media} />
        <Text style={styles.text}>Peep this video of my red bike during a red sunset!! #reddynornot</Text>
        <Text style={styles.subText}>3 million riders like this</Text>
      </View>
      <View style={styles.post}>
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
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  post: {
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

export default Home;
