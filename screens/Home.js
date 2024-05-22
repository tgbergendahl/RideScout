// screens/Home.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'posts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.post}>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.content}</Text>
    </View>
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  post: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default Home;
