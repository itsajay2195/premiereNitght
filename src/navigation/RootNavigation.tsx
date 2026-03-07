import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { AppNavigator } from './Appnavigator';
import ErrorBoundary from '../hoc/ErrorBoundary';

const RootNavigation = () => {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 20}
            style={styles.flex1}
          >
            <ErrorBoundary>
              <AppNavigator />
            </ErrorBoundary>
          </KeyboardAvoidingView>
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
