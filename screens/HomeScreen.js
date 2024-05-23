import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchPosts = async () => {
      const user = auth.currentUser;
      if (user) {
        // Fetch the list of users that the current user follows
        const userDoc = await getDoc(doc(db, 'RideScout/Data/Users', user.uid));
        const userData = userDoc.data();
        const following = userData.following || [];

        // Fetch posts from users that the current user follows
        const postsQuery = query(collection(db, 'RideScout/Data/Posts'), where('userId', 'in', following));
        const postsSnapshot = await getDocs(postsQuery);
        const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
      }
    };
    fetchPosts();
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
      <Button title="Create Post" onPress={() => navigation.navigate('CreatePost')} />
      {posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={styles.noPosts}>Nothing on your feed right now, follow accounts to see what's happening!</Text>
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

export default HomeScreen;
