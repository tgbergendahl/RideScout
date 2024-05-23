// App.js
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
import LoginPage from './screens/LoginPage';
import SignupPage from './screens/SignupPage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="FeaturedRides" component={FeaturedRidesScreen} />
      <Tab.Screen name="ScenicSpots" component={ScenicSpotsScreen} />
      <Tab.Screen name="HogHub" component={HogHubScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
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
        <Stack.Screen name="ChallengesPage" component={ChallengesPageScreen} />
        <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
