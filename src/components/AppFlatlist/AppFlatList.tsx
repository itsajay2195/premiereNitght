import React from 'react';
import {
  FlatList,
  FlatListProps,
  ActivityIndicator,
  View,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Colors, Spacing } from '../../theme/theme';
import { Typography } from '../Typography';

interface AppFlatListProps<T> extends Omit<FlatListProps<T>, 'horizontal'> {
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  horizontal?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function AppFlatList<T>({
  isLoading = false,
  isError = false,
  errorMessage = 'Something went wrong.',
  emptyMessage = 'Nothing here yet.',
  horizontal = false,
  onRefresh,
  isRefreshing = false,
  ...rest
}: AppFlatListProps<T>) {
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.accent} size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Typography variant="caption" color={Colors.danger}>
          {errorMessage}
        </Typography>
      </View>
    );
  }

  return (
    <FlatList
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Typography variant="caption">{emptyMessage}</Typography>
        </View>
      }
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        ) : undefined
      }
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
});
