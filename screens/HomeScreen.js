// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.currentUser) {
      const unsubscribe = onSnapshot(doc(db, 'users', auth.currentUser.uid), (doc) => {
        if (doc.exists()) {
          setFollowing(doc.data().following || []);
        }
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (auth.currentUser && following.length > 0) {
      const q = query(collection(db, 'posts'), where('userID', 'in', following));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [following]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.post}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.content}</Text>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Create Post" onPress={() => navigation.navigate('CreatePostTab')} />
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>Nothing on your feed right now, follow accounts to see what's happening!</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  post: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 8,
  },
});

export default HomeScreen;
