import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Genre, Movie } from '../../api/types/movie';
import { movieApi } from '../../api/movieApi';
import { Typography } from '../../components/Typography';
import { Colors, Spacing } from '../../theme/theme';
import { AppFlatList } from '../../components/AppFlatlist/AppFlatList';
import { SearchBar } from '../../components/Searchbar/Searchbar';
import { MovieCard } from './components/MovieCard';
import { GenreFilter } from './components/GenreFilter';
import { DETAILS_SCREEN } from '../../constants/screenConstants';

function HomeScreen() {
  const navigation = useNavigation<any>();

  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [genreMovies, setGenreMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searching, setSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    throw new Error('game over');
  }, []);
  const loadHome = useCallback(async () => {
    try {
      setIsError(false);
      const [np, pop, gen] = await Promise.all([
        movieApi.nowPlaying(),
        movieApi.popular(),
        movieApi.genres(),
      ]);

      setNowPlaying(np.results.slice(0, 15));
      setPopular(pop.results.slice(0, 15));
      setGenres(gen.genres);
    } catch (e) {
      setIsError(true);
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  useEffect(() => {
    if (!selectedGenre) {
      setGenreMovies([]);
      return;
    }
    movieApi
      .discover(selectedGenre)
      .then(r => setGenreMovies(r.results.slice(0, 15)));
  }, [selectedGenre]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const r = await movieApi.search(searchQuery.trim());
        setSearchResults(r.results);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const goToDetail = (movie: Movie) => {
    navigation.navigate(DETAILS_SCREEN, { movieId: movie.id, movie });
  };

  const isSearching = searchQuery.trim().length > 0;
  const showGenreResults = !!selectedGenre && !isSearching;

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadHome();
            }}
            tintColor={Colors.accent}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
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

        {/* Search */}
        <View style={styles.searchContainer}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        </View>

        {!isSearching && (
          <View style={styles.genreContainer}>
            <GenreFilter
              genres={genres}
              selected={selectedGenre}
              onSelect={setSelectedGenre}
            />
          </View>
        )}
        {/* Search Results */}
        {isSearching && (
          <View style={styles.section}>
            <Typography variant="caption" style={styles.sectionTitle}>
              {searching ? 'Searching...' : `Results for "${searchQuery}"`}
            </Typography>
            <AppFlatList
              horizontal
              data={searchResults}
              keyExtractor={item => String(item.id)}
              contentContainerStyle={styles.row}
              renderItem={({ item }) => (
                <MovieCard movie={item} onPress={goToDetail} size="md" />
              )}
              isLoading={searching}
              emptyMessage="No films found."
            />
          </View>
        )}

        {/* Genre Results */}
        {showGenreResults && (
          <View style={styles.section}>
            <Typography variant="caption" style={styles.sectionTitle}>
              {genres.find(g => g.id === selectedGenre)?.name}
            </Typography>
            <AppFlatList
              horizontal
              data={genreMovies}
              keyExtractor={item => String(item.id)}
              contentContainerStyle={styles.row}
              renderItem={({ item }) => (
                <MovieCard movie={item} onPress={goToDetail} size="md" />
              )}
            />
          </View>
        )}

        {/* Now Playing */}
        {!isSearching && (
          <View style={styles.section}>
            <Typography variant="caption" style={styles.sectionTitle}>
              Now Playing
            </Typography>
            <AppFlatList
              horizontal
              data={nowPlaying}
              keyExtractor={item => String(item.id)}
              contentContainerStyle={styles.row}
              renderItem={({ item }) => (
                <MovieCard movie={item} onPress={goToDetail} size="md" />
              )}
              isLoading={loading}
              isError={isError}
              errorMessage="Failed to load films."
            />
          </View>
        )}

        {/* Popular */}
        {!isSearching && (
          <View style={styles.section}>
            <Typography variant="caption" style={styles.sectionTitle}>
              Popular
            </Typography>
            <AppFlatList
              horizontal
              data={popular}
              keyExtractor={item => String(item.id)}
              contentContainerStyle={styles.row}
              renderItem={({ item }) => (
                <MovieCard movie={item} onPress={goToDetail} size="md" />
              )}
              isLoading={loading}
              isError={isError}
              errorMessage="Failed to load films."
            />
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
});
