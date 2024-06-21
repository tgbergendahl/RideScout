import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Image, RefreshControl } from 'react-native';
import { getPosts } from '../api/posts';
import logo from '../assets/RideScout.jpg';

const FeaturedRides = () => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPosts();
      setPosts(data.sort((a, b) => b.likesCount - a.likesCount).slice(0, 15));
    };

    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    const fetchPosts = async () => {
      const data = await getPosts();
      setPosts(data.sort((a, b) => b.likesCount - a.likesCount).slice(0, 15));
      setRefreshing(false);
    };
    fetchPosts();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
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
  header: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 10,
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});

export default FeaturedRides;
