import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/theme';
import { AppTextInput } from './AppTextInput';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({ value, onChangeText }: Props) {
  return (
    <AppTextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="Search films..."
      returnKeyType="search"
      autoCorrect={false}
      autoCapitalize="none"
      leftIcon={
        <MaterialCommunityIcons
          name="magnify"
          size={18}
          color={Colors.textMuted}
        />
      }
      rightIcon={
        value.length > 0 ? (
          <MaterialCommunityIcons
            name="close"
            size={16}
            color={Colors.textMuted}
          />
        ) : undefined
      }
      onRightIconPress={value.length > 0 ? () => onChangeText('') : undefined}
    />
  );
}
