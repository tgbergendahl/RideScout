import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs, orderBy, limit, getDoc, doc } from 'firebase/firestore';
import defaultProfile from '../assets/defaultProfile.png';

const Inboxes = () => {
  const navigation = useNavigation();
  const [conversations, setConversations] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    } else {
      console.error("No current user found");
    }
  }, [currentUser]);

  const fetchConversations = async () => {
    try {
      const q = query(
        collection(db, 'RideScout/Data/Conversations'),
        where('participants', 'array-contains', currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      const fetchedConversations = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const otherParticipantId = data.participants.find(participant => participant !== currentUser.uid);
        
        // Fetch user data
        const userDoc = await getDoc(doc(db, 'RideScout/Data/Users', otherParticipantId));
        const userData = userDoc.exists() ? userDoc.data() : { username: 'Unknown', profileImage: defaultProfile };

        // Fetch last message
        const messagesQuery = query(
          collection(db, 'RideScout/Data/Messages'),
          where('conversationId', '==', doc.id),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        const messagesSnapshot = await getDocs(messagesQuery);
        const lastMessage = messagesSnapshot.docs[0] ? messagesSnapshot.docs[0].data().text : 'No messages yet';

        return {
          id: doc.id,
          username: userData.username,
          profileImage: userData.profileImage || defaultProfile,
          lastMessage: lastMessage,
          participants: data.participants,
        };
      }));

      setConversations(fetchedConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      Alert.alert('Error', 'There was an issue fetching the conversations. Please try again later.');
    }
  };

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationContainer}
      onPress={() => navigation.navigate('Inbox', { conversationId: item.id, recipientId: item.participants.find(participant => participant !== currentUser.uid) })}
    >
      <Image source={item.profileImage ? { uri: item.profileImage } : defaultProfile} style={styles.profileImage} />
      <View style={styles.textContainer}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  if (!currentUser) {
    return (
      <View>
        <Text>No user data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Messages</Text>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    flexGrow: 1,
  },
  conversationContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#888',
  },
});

export default Inboxes;
