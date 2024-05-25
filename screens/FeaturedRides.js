import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Image } from 'react-native';
import Post from '../components/Post'; // Adjust the path as necessary
import { getFeaturedRides } from '../api/rides';
import logo from '../assets/Ride scout (2).jpg'; // Ensure the correct path to your logo image

const FeaturedRides = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFeaturedRides();
      setPosts(data);
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      {posts.length === 0 ? (
        <Text>No featured rides at the moment, check back soon!</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Post post={item} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  logo: {
    width: 100,
    height: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default FeaturedRides;
