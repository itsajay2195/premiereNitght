import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Genre } from '../../../api/types/movie';
import { Colors, Radius, Spacing } from '../../../theme/theme';
import { AppFlatList } from '../../../components/AppFlatlist/AppFlatList';

interface Props {
  genres: Genre[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}

const ALL_PILL: Genre = { id: -1, name: 'All' };

export function GenreFilter({ genres, selected, onSelect }: Props) {
  const data = [ALL_PILL, ...genres];

  return (
    <AppFlatList
      horizontal
      data={data}
      keyExtractor={item => String(item.id)}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
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
      )}
    />
  );
}

function Pill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.pill, active && styles.pillActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
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
