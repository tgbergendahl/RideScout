// screens/Profile.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import logo from '../assets/RideScout.jpg'; // Ensure the correct path to your logo image

const Profile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, 'RideScout/Data/Users', userId));
      if (userDoc.exists()) {
        setUser(userDoc.data());
      }
    };

    const fetchUserPosts = async () => {
      const postsQuery = query(collection(db, 'RideScout/Data/Posts'), where('userId', '==', userId));
      const postsSnapshot = await getDocs(postsQuery);
      const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    };

    fetchUser();
    fetchUserPosts();
  }, [db, userId]);

  const onRefresh = () => {
    setRefreshing(true);
    const fetchData = async () => {
      const userDoc = await getDoc(doc(db, 'RideScout/Data/Users', userId));
      if (userDoc.exists()) {
        setUser(userDoc.data());
      }

      const postsQuery = query(collection(db, 'RideScout/Data/Posts'), where('userId', '==', userId));
      const postsSnapshot = await getDocs(postsQuery);
      const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
      setRefreshing(false);
    };

    fetchData();
  };

  const renderPost = ({ item }) => (
    <View style={styles.postItem}>
      <Text>{item.content}</Text>
      {item.imageUrls && item.imageUrls.map((url, index) => (
        <Image key={index} source={{ uri: url }} style={styles.image} />
      ))}
      {item.videoUrl && <Video source={{ uri: item.videoUrl }} style={styles.video} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      {user && (
        <>
          <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
          <Text style={styles.bio}>{user.bio}</Text>
        </>
      )}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 20,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  postItem: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  video: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
});

export default Profile;
