import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
} from 'react-native';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import defaultProfile from '../assets/defaultProfile.png';

const Inbox = ({ route }) => {
  const { conversationId, recipientId } = route.params;
  const { user: currentUser, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [recipientData, setRecipientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && recipientId && !authLoading) {
      console.log("Current user found:", currentUser.uid);
      fetchRecipientData();
      fetchMessages();
    } else {
      console.log("No current user found, recipientId is undefined, or auth is loading.");
    }
  }, [currentUser, recipientId, authLoading]);

  const fetchRecipientData = async () => {
    try {
      const recipientDoc = await getDoc(doc(db, 'RideScout/Data/Users', recipientId));
      if (recipientDoc.exists()) {
        setRecipientData(recipientDoc.data());
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipient data:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      if (!currentUser?.uid || !recipientId) {
        console.error("User ID or recipient ID is undefined.");
        return;
      }
      console.log("Fetching messages with:", { currentUser: currentUser.uid, recipientId });
      
      const messagesSnapshot = await getDocs(collection(db, 'RideScout/Data/Messages'));
      const allMessages = messagesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      
      const filteredMessages = allMessages.filter(msg => 
        msg.participants.includes(currentUser.uid) && msg.participants.includes(recipientId)
      );
      
      filteredMessages.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);

      setMessages(filteredMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSend = async () => {
    if (message.trim() !== '' && currentUser) {
      await addDoc(collection(db, 'RideScout/Data/Messages'), {
        text: message,
        sender: currentUser.uid,
        participants: [currentUser.uid, recipientId],
        conversationId,
        timestamp: new Date(),
      });
      setMessage('');
      fetchMessages(); // Fetch messages again after sending
    }
  };

  if (authLoading || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={90} // Adjust as needed
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Image
              source={recipientData?.profileImage ? { uri: recipientData.profileImage } : defaultProfile}
              style={styles.profilePicture}
            />
            <Text style={styles.header}>Messaging with {recipientData?.username || 'Unknown'}</Text>
          </View>
          <FlatList
            data={messages}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageContainer,
                  item.sender === currentUser.uid ? styles.myMessage : styles.theirMessage,
                ]}
              >
                <Text style={item.sender === currentUser.uid ? styles.myMessageText : styles.theirMessageText}>
                  {item.text}
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message..."
            />
            <Button title="Send" onPress={handleSend} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    maxWidth: '70%',
  },
  myMessage: {
    backgroundColor: '#000',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: '#fff', // White text for the user's message
  },
  theirMessageText: {
    color: '#000', // Black text for the other person's message
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginBottom: 10, // Add margin to avoid keyboard overlap
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10, // Increase padding for better clickability
  },
});

export default Inbox;
