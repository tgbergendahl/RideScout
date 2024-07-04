import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addComment, getComments } from '../api/comments';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const Comments = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { postId } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userData, setUserData] = useState({});
  const currentUser = auth.currentUser;

  useEffect(() => {
    fetchComments();
    fetchUserData();
  }, []);

  const fetchComments = async () => {
    try {
      const commentsData = await getComments(postId);
      setComments(commentsData);
      console.log('Fetched comments:', commentsData); // Log fetched comments
    } catch (error) {
      console.error('Error fetching comments:', error);
      Alert.alert('Error', 'There was an issue fetching comments. Please try again later.');
    }
  };

  const fetchUserData = async () => {
    try {
      const userRef = doc(db, 'RideScout/Data/Users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
        console.log('User Data:', userDoc.data()); // Log user data
      } else {
        console.error("No user data found in Firestore");
        Alert.alert('Error', 'No user data found in Firestore');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'There was an issue fetching user data. Please try again later.');
    }
  };

  const handleAddComment = async () => {
    try {
      await addComment(postId, newComment, currentUser.uid);
      setNewComment('');
      fetchComments(); // Refresh comments after adding a new one
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'There was an issue adding your comment. Please try again later.');
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <Text style={styles.commentText}>{item.content}</Text>
      <Text style={styles.commentAuthor}>{userData.username}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderComment}
      />
      <TextInput
        style={styles.input}
        placeholder="Add a comment"
        value={newComment}
        onChangeText={setNewComment}
      />
      <Button title="Post Comment" onPress={handleAddComment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  commentText: {
    fontSize: 16,
  },
  commentAuthor: {
    fontSize: 12,
    color: '#888',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default Comments;
