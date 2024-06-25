import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const Comment = ({ postId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const auth = getAuth();
  const db = getFirestore();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'RideScout/Data/Comments'),
      (snapshot) => {
        const commentsData = snapshot.docs
          .filter(doc => doc.data().postId === postId)
          .map(doc => ({ id: doc.id, ...doc.data() }));
        setComments(commentsData);
      },
      (error) => {
        console.error('Error fetching comments:', error);
      }
    );

    return () => unsubscribe();
  }, [postId, db]);

  const handleAddComment = async () => {
    if (comment.trim()) {
      try {
        await addDoc(collection(db, 'RideScout/Data/Comments'), {
          postId,
          userId: currentUser.uid,
          content: comment,
          createdAt: serverTimestamp(),
          userName: currentUser.displayName || 'Unknown User',
        });
        setComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
        Alert.alert('Error', 'There was an issue adding your comment.');
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(db, 'RideScout/Data/Comments', commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      Alert.alert('Error', 'There was an issue deleting the comment.');
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <Text style={styles.commentUser}>{item.userName}</Text>
      <Text style={styles.commentContent}>{item.content}</Text>
      <Text style={styles.commentTimestamp}>{new Date(item.createdAt?.seconds * 1000).toLocaleString()}</Text>
      {item.userId === currentUser.uid && (
        <TouchableOpacity onPress={() => handleDeleteComment(item.id)} style={styles.deleteButton}>
          <Icon name="trash" size={20} color="#000" />
        </TouchableOpacity>
      )}
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
        value={comment}
        onChangeText={setComment}
        placeholder="Add a comment..."
        style={styles.input}
      />
      <Button title="Post Comment" onPress={handleAddComment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentUser: {
    fontWeight: 'bold',
  },
  commentContent: {
    marginVertical: 5,
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
});

export default Comment;
