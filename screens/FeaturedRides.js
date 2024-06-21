import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Image, RefreshControl } from 'react-native';
import Post from '../components/Post'; // Adjust the path as necessary
import { getFeaturedRides } from '../api/rides';
import logo from '../assets/Ride scout (2).jpg'; // Ensure the correct path to your logo image

const FeaturedRides = () => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getFeaturedRides();
    setPosts(data);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  };

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
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  logo: {
    width: 300, // Same width as in HomeScreen
    height: 150, // Same height as in HomeScreen
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default FeaturedRides;
