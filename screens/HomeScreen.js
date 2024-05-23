// screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Image } from 'react-native';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!auth.currentUser) return;

      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const following = userData.following || [];

        if (following.length === 0) {
          setPosts([]);
          return;
        }

        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('userID', 'in', following));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedPosts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPosts(fetchedPosts);
        });

        return unsubscribe;
      }
    };

    const unsubscribe = fetchPosts();
    return () => unsubscribe && unsubscribe();
  }, []);

  const renderPost = ({ item }) => (
    <View style={styles.post}>
      {item.image && <Image source={{ uri: item.image }} style={styles.postImage} />}
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text>{item.content}</Text>
      <Text>Posted by: {item.userID}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Create Post" onPress={() => navigation.navigate('CreatePost')} />
      {posts.length === 0 ? (
        <Text>Nothing on your feed right now, follow accounts to see what's happening!</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
        />
      )}
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});

export default HomeScreen;
