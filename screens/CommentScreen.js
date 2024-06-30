import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getComments, addComment, deleteComment, likeComment } from '../api/comments';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import defaultProfile from '../assets/defaultProfile.png';

const CommentScreen = ({ route }) => {
  const { postId } = route.params;
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [users, setUsers] = useState({});
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const fetchedComments = await getComments(postId);
    setComments(fetchedComments);
    fetchUserData(fetchedComments);
  };

  const fetchUserData = async (comments) => {
    const userIds = [...new Set(comments.map(comment => comment.userId))];
    const userPromises = userIds.map(userId => getDoc(doc(db, 'RideScout/Data/Users', userId)));
    const userDocs = await Promise.all(userPromises);
    const usersData = {};
    userDocs.forEach(userDoc => {
      if (userDoc.exists()) {
        usersData[userDoc.id] = userDoc.data();
      }
    });
    setUsers(usersData);
  };

  const handleAddComment = async () => {
    if (comment.trim()) {
      await addComment(postId, comment, currentUser.uid);
      setComment('');
      fetchComments();
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (error) {
      Alert.alert('Error', 'There was an issue deleting the comment.');
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await likeComment(commentId, currentUser.uid);
      fetchComments();
    } catch (error) {
      Alert.alert('Error', 'There was an issue liking the comment.');
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <View style={styles.userInfo}>
        <Image
          source={users[item.userId]?.profileImage ? { uri: users[item.userId].profileImage } : defaultProfile}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{users[item.userId]?.username || 'User not found'}</Text>
      </View>
      <Text style={styles.commentText}>{item.content}</Text>
      <View style={styles.commentActions}>
        <TouchableOpacity onPress={() => handleLikeComment(item.id)} style={styles.actionButton}>
          <Icon name="thumbs-up" size={20} color="#000" />
          <Text>{item.likesCount}</Text>
        </TouchableOpacity>
        {item.userId === currentUser.uid && (
          <TouchableOpacity onPress={() => handleDeleteComment(item.id)} style={styles.actionButton}>
            <Icon name="trash" size={20} color="#000" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderComment}
        contentContainerStyle={styles.commentsList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
        />
        <Button title="Send" onPress={handleAddComment} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  commentsList: {
    flexGrow: 1,
  },
  commentContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 14,
    marginBottom: 5,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
  },
});

export default CommentScreen;
