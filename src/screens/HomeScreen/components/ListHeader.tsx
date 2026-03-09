import { StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
import { Genre } from '../../../api/types/movie';
import { GenreFilter } from './GenreFilter';
import { SearchBar } from '../../../components/Searchbar';
import { Colors, Spacing } from '../../../theme/theme';
import { Typography } from '../../../components/Typography';

interface ListHeaderProps {
  searchQuery: string;
  genres: Genre[];
  selectedGenre: number | null;
  isSearching: boolean;
  onChangeText: (text: string) => void;
  onSelectGenre: (id: number | null) => void;
}

const ListHeader = ({
  searchQuery,
  genres,
  selectedGenre,
  isSearching,
  onChangeText,
  onSelectGenre,
}: ListHeaderProps) => {
  return (
    <View>
      <View style={styles.header}>
        <Typography variant="heading">PREMIERE</Typography>
        <Typography
          variant="caption"
          color={Colors.accent}
          style={styles.logoSub}
        >
          NIGHT
        </Typography>
      </View>
      <View style={styles.searchContainer}>
        <SearchBar value={searchQuery} onChangeText={onChangeText} />
      </View>
      {!isSearching && (
        <View style={styles.genreContainer}>
          <GenreFilter
            genres={genres}
            selected={selectedGenre}
            onSelect={onSelectGenre}
          />
        </View>
      )}
    </View>
  );
};

export default memo(ListHeader);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  logoSub: { letterSpacing: 8, fontWeight: '700', marginTop: -4 },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  genreContainer: { marginBottom: Spacing.sm },
});
