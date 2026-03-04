import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import {
  DETAILS_SCREEN,
  HOME_SCREEN,
  WATCHLIST_SCREEN,
} from '../constants/screenConstants';
import WatchlistScreen from '../screens/WatchlistScreen/WatchlistScreen';
import DetailsScreen from '../screens/DetailsScreen/DetailsScreen';
import { Colors } from '../theme/theme';
import { Text } from 'react-native';

const Stack = createNativeStackNavigator<any>(); //add types
const Tab = createBottomTabNavigator<any>(); //add types

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textFaint,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.5,
        },
        tabBarIcon: ({ focused }) => {
          const icon = route.name === 'Home' ? '🎬' : '🎞';
          return (
            <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.5 }}>
              {icon}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen
        name={HOME_SCREEN}
        component={HomeScreen}
        options={{ tabBarLabel: 'DISCOVER' }}
      />
      <Tab.Screen
        name={WATCHLIST_SCREEN}
        component={WatchlistScreen}
        options={{ tabBarLabel: 'WATCHLIST' }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen
        name={DETAILS_SCREEN}
        component={DetailsScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}
