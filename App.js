// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import ErrorBoundary from './components/ErrorBoundary';
import { StripeProvider } from '@stripe/stripe-react-native';

import HomeScreen from './screens/HomeScreen';
import Profile from './screens/Profile';
import HogHub from './screens/HogHub';
import FeaturedRides from './screens/FeaturedRides';
import ScenicSpots from './screens/ScenicSpots';
import ChallengesPage from './screens/ChallengesPage';
import CreatePost from './screens/CreatePost';
import LoginPage from './screens/LoginPage';
import SignupPage from './screens/SignupPage';
import UpgradeAccount from './screens/UpgradeAccount';
import ContactSeller from './screens/ContactSeller';
import CreateScenicSpot from './screens/CreateScenicSpot';
import CreateHog from './screens/CreateHog';
import EditProfile from './screens/EditProfile';
import CommentScreen from './screens/CommentScreen';
import Followers from './screens/Followers';
import Following from './screens/Following';
import RiderDirectory from './screens/RiderDirectory';
import RiderProfile from './screens/RiderProfile';
import Inbox from './screens/Inbox';
import NotificationsScreen from './screens/NotificationsScreen';
import RideScoutStore from './screens/RideScoutStore';
import ProductDetail from './screens/ProductDetail';
import RideScoutDisclaimer from './screens/RideScoutDisclaimer';
import PaymentScreen from './screens/PaymentScreen';

import { AuthProvider } from './contexts/AuthContext';
import './firebaseConfig';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="FeaturedRides"
        component={FeaturedRides}
        options={{ tabBarIcon: ({ color, size }) => <Icon name="star" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="ScenicSpots"
        component={ScenicSpots}
        options={{ tabBarIcon: ({ color, size }) => <Icon name="map-marker" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="HogHub"
        component={HogHub}
        options={{ tabBarIcon: ({ color, size }) => <Icon name="motorcycle" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ tabBarIcon: ({ color, size }) => <Icon name="user" color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <StripeProvider publishableKey="pk_live_51PYJxqRwF48RINrDW5T3YPID0WpDbTObuxzqoBUjiGa3KaIVF3LXtEvrYo1wvAi6DmtymkcJlEBvFklRqcfCZdyw00PaUl6xxP">
          <NavigationContainer>
            <Stack.Navigator initialRouteName="LoginPage">
              <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
              <Stack.Screen name="SignupPage" component={SignupPage} options={{ headerShown: false }} />
              <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
              <Stack.Screen name="ChallengesPage" component={ChallengesPage} />
              <Stack.Screen name="CreatePost" component={CreatePost} />
              <Stack.Screen name="UpgradeAccount" component={UpgradeAccount} />
              <Stack.Screen name="ContactSeller" component={ContactSeller} />
              <Stack.Screen name="CreateScenicSpot" component={CreateScenicSpot} />
              <Stack.Screen name="CreateHog" component={CreateHog} />
              <Stack.Screen name="EditProfile" component={EditProfile} />
              <Stack.Screen name="CommentScreen" component={CommentScreen} />
              <Stack.Screen name="Followers" component={Followers} />
              <Stack.Screen name="Following" component={Following} />
              <Stack.Screen name="RiderDirectory" component={RiderDirectory} />
              <Stack.Screen name="RiderProfile" component={RiderProfile} />
              <Stack.Screen name="Inbox" component={Inbox} />
              <Stack.Screen name="Notifications" component={NotificationsScreen} />
              <Stack.Screen name="RideScoutStore" component={RideScoutStore} />
              <Stack.Screen name="ProductDetail" component={ProductDetail} />
              <Stack.Screen name="RideScoutDisclaimer" component={RideScoutDisclaimer} />
              <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </StripeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
