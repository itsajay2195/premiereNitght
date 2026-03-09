import React, { useCallback } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { Movie } from '../../api/types/movie';
import { Typography } from '../../components/Typography';
import { Colors, Spacing } from '../../theme/theme';
import { MovieCard } from './components/MovieCard';
import ListHeader from './components/ListHeader';
import { buildSections } from './state/buildSections';
import type { Section } from './type';
import { DETAILS_SCREEN } from '../../constants/screens';
import { AppFlatList } from '../../components/AppFlatList';
import type { RootStackNavigationProp } from '../../navigation/types';
import { useHomeScreen } from './state/useHomescreen';

function HomeScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { state, onRefresh, setSearchQuery, setSelectedGenre } =
    useHomeScreen();

  const {
    nowPlaying,
    popular,
    genres,
    genreMovies,
    searchResults,
    selectedGenre,
    searchQuery,
    loading,
    searching,
    refreshing,
    isError,
  } = state;

  const isSearching = searchQuery?.trim().length > 0;
  const showGenreResults = !!selectedGenre && !isSearching;

  const goToDetail = useCallback(
    (movie: Movie) =>
      navigation.navigate(DETAILS_SCREEN, { movieId: movie.id, movie }),
    [navigation],
  );

  const sections = buildSections({
    isSearching,
    showGenreResults,
    searchQuery,
    searching,
    searchResults,
    genres,
    selectedGenre,
    genreMovies,
    nowPlaying,
    popular,
    loading,
    isError,
  });

  const renderSection = useCallback(
    ({ item: section }: { item: Section }) => (
      <View style={styles.section}>
        <Typography variant="caption" style={styles.sectionTitle}>
          {section.title}
        </Typography>
        <AppFlatList
          horizontal={section.orientation === 'horizontal'}
          data={section.data}
          keyExtractor={item => String(item?.id)}
          contentContainerStyle={styles.row}
          renderItem={({ item }: { item: Movie }) => (
            <MovieCard movie={item} onPress={goToDetail} size={section.size} />
          )}
          isLoading={section.isLoading}
          isError={section.isError}
          emptyMessage={section.emptyMessage}
        />
      </View>
    ),
    [goToDetail],
  );

  return (
    <View style={styles.safe}>
      <AppFlatList
        data={sections}
        keyExtractor={item => item.id}
        renderItem={renderSection}
        ListHeaderComponent={
          <ListHeader
            searchQuery={searchQuery}
            genres={genres}
            selectedGenre={selectedGenre}
            isSearching={isSearching}
            onChangeText={setSearchQuery}
            onSelectGenre={setSelectedGenre}
          />
        }
        ListFooterComponent={<View style={styles.footer} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
          />
        }
      />
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
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
  section: { marginBottom: Spacing.lg },
  sectionTitle: {
    letterSpacing: 2,
    textTransform: 'uppercase',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  row: { paddingHorizontal: Spacing.md },
  footer: { height: 40 },
});
