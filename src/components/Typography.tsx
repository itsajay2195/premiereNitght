import React from 'react';
import { Text, TextStyle, StyleSheet, TextProps } from 'react-native';
import { Colors } from '../theme/theme';

type TypographyVariant = 'heading' | 'title' | 'body' | 'caption';

interface TypographyProps extends TextProps {
  variant: TypographyVariant;
  color?: string;
  children: React.ReactNode;
}

export function Typography({
  variant,
  color,
  style,
  children,
  ...rest
}: TypographyProps) {
  return (
    <Text style={[styles[variant], color ? { color } : null, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create<Record<TypographyVariant, TextStyle>>({
  heading: {
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: 10,
    color: Colors.text,
    fontStyle: 'italic',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: Colors.text,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.text,
    lineHeight: 22,
    opacity: 0.85,
  },
  caption: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: Colors.textMuted,
  },
});
