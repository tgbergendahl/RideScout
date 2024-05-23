import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/Profile';
import HogHubScreen from './screens/HogHub';
import FeaturedRidesScreen from './screens/FeaturedRides';
import ScenicSpotsScreen from './screens/ScenicSpots';
import ChallengesPageScreen from './screens/ChallengesPage';
import CreatePostScreen from './screens/CreatePost';
import CreateScenicSpotScreen from './screens/CreateScenicSpot';
import LoginPage from './screens/LoginPage';
import SignupPage from './screens/SignupPage';
import CommentScreen from './screens/CommentScreen';
import ContactSellerScreen from './screens/ContactSellerScreen';
import CustomHeader from './components/CustomHeader';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{ header: () => <CustomHeader /> }} />
      <Tab.Screen name="FeaturedRides" component={FeaturedRidesScreen} options={{ header: () => <CustomHeader /> }} />
      <Tab.Screen name="ScenicSpots" component={ScenicSpotsScreen} options={{ header: () => <CustomHeader /> }} />
      <Tab.Screen name="HogHub" component={HogHubScreen} options={{ header: () => <CustomHeader /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ header: () => <CustomHeader /> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPage">
        <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name="SignupPage" component={SignupPage} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="ChallengesPage" component={ChallengesPageScreen} options={{ header: () => <CustomHeader /> }} />
        <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ header: () => <CustomHeader /> }} />
        <Stack.Screen name="CreateScenicSpot" component={CreateScenicSpotScreen} options={{ header: () => <CustomHeader /> }} />
        <Stack.Screen name="Comments" component={CommentScreen} options={{ header: () => <CustomHeader /> }} />
        <Stack.Screen name="ContactSeller" component={ContactSellerScreen} options={{ header: () => <CustomHeader /> }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
