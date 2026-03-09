import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import type { LinkingOptions } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { Colors } from '../theme/theme';
import Toast from 'react-native-toast-message';
import {
  DETAILS_SCREEN,
  HOME_SCREEN,
  MAIN_SCREEN,
  WATCHLIST_SCREEN,
} from '../constants/screens';
import ErrorBoundary from '../components/ErrorBoundary';
import NetworkBanner from '../components/NetworkBanner';
import type { RootStackParamList } from './types';
import { AppNavigator } from './Appnavigator';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['premierenight://'],
  config: {
    screens: {
      [MAIN_SCREEN]: {
        screens: {
          [HOME_SCREEN]: 'home',
          [WATCHLIST_SCREEN]: 'watchlist',
        },
      },
      [DETAILS_SCREEN]: 'movie/:movieId',
    },
  },
};

const RootNavigation = () => {
  return (
    <NavigationContainer linking={linking}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar
            barStyle="light-content"
            backgroundColor={Colors.background}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 20}
            style={styles.flex1}
          >
            <ErrorBoundary>
              <AppNavigator />
            </ErrorBoundary>
          </KeyboardAvoidingView>
          <NetworkBanner />
          <Toast />
        </SafeAreaView>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default RootNavigation;

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: {
    flex: 1,
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
