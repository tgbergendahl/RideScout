import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  button: {
    marginBottom: 20,
  },
  textCenter: {
    textAlign: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  email: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  followerCount: {
    fontSize: 16,
    marginBottom: 10,
  },
  followingCount: {
    fontSize: 16,
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  sellerBadge: {
    fontSize: 16,
    marginTop: 20,
    color: 'green',
    fontWeight: 'bold',
  },
});
