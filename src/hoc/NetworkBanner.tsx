import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Typography } from '../components/Typography';
import { Colors, Spacing } from '../theme/theme';

function NetworkBanner() {
  const [isConnected, setIsConnected] = React.useState(false);
  const translateY = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isConnected ? -50 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isConnected, translateY]);

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY }] }]}>
      <View style={styles.content}>
        <Typography variant="caption" color={Colors.background}>
          No internet connection
        </Typography>
      </View>
    </Animated.View>
  );
}

export default NetworkBanner;

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: Colors.danger,
    paddingVertical: Spacing.xs + 2,
  },
  content: {
    alignItems: 'center',
  },
});
