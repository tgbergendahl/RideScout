import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Image, RefreshControl, TouchableOpacity } from 'react-native';
import { collection, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Post from '../components/Post';
import logo from '../assets/RideScout.jpg';

const FeaturedRides = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);

  const fetchFeaturedPosts = async (refresh = false) => {
    const oneWeekAgo = Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    let postsQuery = query(
      collection(db, 'RideScout/Data/Posts'),
      where('createdAt', '>=', oneWeekAgo),
      orderBy('likesCount', 'desc'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    if (!refresh && lastVisible) {
      postsQuery = query(
        collection(db, 'RideScout/Data/Posts'),
        where('createdAt', '>=', oneWeekAgo),
        orderBy('likesCount', 'desc'),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(20)
      );
    }

    const querySnapshot = await getDocs(postsQuery);
    const fetchedPosts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    if (refresh) {
      setPosts(fetchedPosts);
    } else {
      setPosts(prevPosts => [...prevPosts, ...fetchedPosts]);
    }
  };

  useEffect(() => {
    fetchFeaturedPosts(true);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeaturedPosts(true).then(() => setRefreshing(false));
  };

  const handleLoadMore = () => {
    fetchFeaturedPosts();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      <TouchableOpacity style={styles.findRiderButton} onPress={() => navigation.navigate('RiderDirectory')}>
        <Text style={styles.findRiderButtonText}>Find a Rider</Text>
      </TouchableOpacity>
      {posts.length === 0 ? (
        <Text style={styles.noRidesText}>Browse the most popular rides</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Post post={item} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
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
  findRiderButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  findRiderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noRidesText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default FeaturedRides;
