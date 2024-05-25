import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updateProfile } from '../api/users'; // Adjust the path as necessary

const EditProfile = ({ route }) => {
  const { user } = route.params;
  const [bio, setBio] = useState(user.bio);
  const navigation = useNavigation();

  const handleSave = async () => {
    try {
      await updateProfile(user.id, { bio });
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="Edit your bio"
        style={styles.input}
      />
      <Button title="Finish Editing" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
});

export default EditProfile;
