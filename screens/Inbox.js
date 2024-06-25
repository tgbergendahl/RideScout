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
} from 'react-native';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';

const Inbox = ({ route }) => {
  const { recipientId, recipientName } = route.params;
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      const q = query(
        collection(db, 'RideScout/Data/Messages'),
        where('participants', 'array-contains', currentUser.uid),
        orderBy('timestamp', 'asc')
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().participants.includes(recipientId)) {
            msgs.push({ ...doc.data(), id: doc.id });
          }
        });
        setMessages(msgs);
      });

      return () => unsubscribe();
    }
  }, [currentUser, recipientId]);

  const handleSend = async () => {
    if (message.trim() !== '' && currentUser) {
      await addDoc(collection(db, 'RideScout/Data/Messages'), {
        text: message,
        sender: currentUser.uid,
        participants: [currentUser.uid, recipientId],
        timestamp: new Date(),
      });
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Messaging with {recipientName}</Text>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                item.sender === currentUser.uid ? styles.myMessage : styles.theirMessage,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  messageContainer: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  myMessage: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#f1f0f0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc',
    padding: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});

export default Inbox;
