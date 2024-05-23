import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const FeaturedRides = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      const postsQuery = query(collection(db, 'RideScout/Data/Posts'), orderBy('likes', 'desc'), limit(10));
      const postsSnapshot = await getDocs(postsQuery);
      const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    };
    fetchFeaturedPosts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.post}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
      <Text>Likes: {item.likes}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Comments', { postId: item.id })}>
        <Text style={styles.commentsLink}>View Comments</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={styles.noPosts}>No featured rides yet, stay tuned!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  post: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    marginTop: 10,
    fontSize: 16,
  },
  image: {
    marginTop: 10,
    height: 200,
    width: '100%',
    borderRadius: 10,
  },
  commentsLink: {
    marginTop: 10,
    color: 'blue',
  },
  noPosts: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default FeaturedRides;
