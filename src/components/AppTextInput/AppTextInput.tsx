import React, { useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors, Spacing, Radius } from '../../theme/theme';
import { Typography } from '../Typography';

interface AppTextInputProps extends TextInputProps {
  label?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export function AppTextInput({
  label,
  errorMessage,
  leftIcon,
  rightIcon,
  onRightIconPress,
  editable = true,
  style,
  ...rest
}: AppTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const isDisabled = editable === false;
  const isError = !!errorMessage;

  const getBorderColor = () => {
    if (isError) return Colors.danger;
    if (isDisabled) return Colors.textFaint;
    if (isFocused) return Colors.accent;
    return Colors.border;
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Typography variant="caption" style={styles.label}>
          {label}
        </Typography>
      )}

      <View
        style={[
          styles.container,
          { borderColor: getBorderColor() },
          isDisabled && styles.disabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.textFaint}
          selectionColor={Colors.accent}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />

        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {isError && (
        <Typography
          variant="caption"
          color={Colors.danger}
          style={styles.error}
        >
          {errorMessage}
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    marginBottom: Spacing.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  disabled: {
    opacity: 0.4,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
    padding: 0,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  rightIcon: {
    marginLeft: Spacing.sm,
  },
  error: {
    marginTop: Spacing.xs,
    marginLeft: Spacing.sm,
  },
});
