import React, { Component, ErrorInfo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '../components/Typography';
import { Colors, Spacing } from '../theme/theme';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Replace with your logging service e.g. Sentry
    console.error('[ErrorBoundary]', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Typography variant="heading" style={styles.icon}>
            ✕
          </Typography>
          <Typography variant="title" style={styles.title}>
            Something went wrong
          </Typography>
          <Typography variant="body" style={styles.message}>
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </Typography>
          <TouchableOpacity style={styles.button} onPress={this.handleReset}>
            <Typography variant="caption" color={Colors.background}>
              Try Again
            </Typography>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  icon: {
    color: Colors.danger,
    marginBottom: Spacing.md,
  },
  title: {
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 2,
    borderRadius: 999,
  },
});
