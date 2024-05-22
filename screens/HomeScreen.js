// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Image, ActivityIndicator } from 'react-native';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = () => {
      const q = query(collection(db, 'posts'), where('userID', 'in', auth.currentUser.following || []));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const postsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setPosts(postsData);
        setLoading(false);
      });

      return unsubscribe;
    };

    if (auth.currentUser) {
      const unsubscribe = fetchPosts();
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.post}>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.content}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Create Post" onPress={() => navigation.navigate('CreatePost')} />
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.postsContainer}
        ListEmptyComponent={<Text>Nothing on your feed right now, follow accounts to see what's happening!</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postsContainer: {
    paddingVertical: 10,
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

export default HomeScreen;
