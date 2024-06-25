import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Image, RefreshControl, Button } from 'react-native';
import { collection, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Post from '../components/Post';
import logo from '../assets/RideScout.jpg';

const FeaturedRides = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFeaturedPosts = async () => {
    const oneWeekAgo = Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const postsQuery = query(
      collection(db, 'RideScout/Data/Posts'),
      where('createdAt', '>=', oneWeekAgo),
      orderBy('createdAt', 'desc'),
      orderBy('likesCount', 'desc'),
      limit(20)
    );
    const querySnapshot = await getDocs(postsQuery);
    const fetchedPosts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(fetchedPosts);
  };

  useEffect(() => {
    fetchFeaturedPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeaturedPosts().then(() => setRefreshing(false));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      <Button title="Find a Rider" onPress={() => navigation.navigate('RiderDirectory')} />
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
