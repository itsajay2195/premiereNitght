import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Genre } from '../../../api/types/movie';
import { Colors, Radius, Spacing } from '../../../theme/theme';
import { AppFlatList } from '../../../components/AppFlatlist/AppFlatList';
import { Pill } from '../../../components/Pill/Pill';

interface Props {
  genres: Genre[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}

const ALL_PILL: Genre = { id: -1, name: 'All' };

export function GenreFilter({ genres, selected, onSelect }: Props) {
  const data = [ALL_PILL, ...genres];

  const renderItem = useCallback(
    ({ item }: any) => {
      return (
        <Pill
          label={item.name}
          active={item.id === -1 ? selected === null : selected === item.id}
          onPress={() => {
            if (item.id === -1) {
              onSelect(null);
            } else {
              onSelect(item.id === selected ? null : item.id);
            }
          }}
        />
      );
    },
    [onSelect, selected],
  );

  return (
    <AppFlatList
      horizontal
      data={data}
      keyExtractor={item => String(item.id)}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.xs,
  },
  pillActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  pillText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  pillTextActive: {
    color: Colors.background,
  },
});
