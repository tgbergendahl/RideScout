// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
import Post from '../components/Post';

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const postsQuery = query(collection(db, 'RideScout/Data/Posts'), orderBy('createdAt', 'desc'));
    const postsSnapshot = await getDocs(postsQuery);
    const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(postsData);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default HomeScreen;
