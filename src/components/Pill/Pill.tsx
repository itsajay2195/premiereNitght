import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/theme';

interface PillProps {
  label: string;
  variant?: 'filled' | 'outlined';
  active?: boolean;
  color?: string;
  onPress?: () => void;
}

export function Pill({
  label,
  variant = 'filled',
  active = false,
  color,
  onPress,
}: PillProps) {
  const Container = onPress ? TouchableOpacity : View;

  const containerProps = onPress ? { onPress, activeOpacity: 0.7 } : {};

  const isActive = !!onPress && active;

  return (
    <Container
      style={[
        styles.base,
        variant === 'outlined' ? styles.outlined : styles.filled,
        isActive && styles.activeBackground,
        color && variant === 'outlined' ? { borderColor: color } : null,
      ]}
      {...containerProps}
    >
      <Text
        style={[
          styles.label,
          isActive ? styles.activeLabelText : styles.defaultLabelText,
          color ? { color } : null,
        ]}
      >
        {label}
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  filled: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeBackground: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  defaultLabelText: {
    color: Colors.textMuted,
  },
  activeLabelText: {
    color: Colors.background,
  },
});
