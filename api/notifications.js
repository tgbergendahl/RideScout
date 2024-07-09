// api/notifications.js
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const sendNotification = async (recipientId, senderId, type, postId = null, commentId = null) => {
  try {
    await addDoc(collection(db, 'RideScout/Data/Notifications'), {
      recipientId,
      senderId,
      type,
      postId,
      commentId,
      message: generateMessage(type, senderId),  // Customize the message format as needed
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

const generateMessage = (type, senderId) => {
  switch (type) {
    case 'like':
      return `${senderId} liked your post.`;
    case 'comment':
      return `${senderId} commented on your post.`;
    case 'follow':
      return `${senderId} followed you.`;
    case 'message':
      return `${senderId} sent you a message.`;
    default:
      return '';
  }
};
