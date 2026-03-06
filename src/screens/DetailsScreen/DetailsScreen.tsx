import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Movie } from '../../api/types/movie';
import { Colors, Radius, Spacing } from '../../theme/theme';
import { getBackdropUrl, getPosterUrl } from '../../utils/imageUtils';
import { movieApi } from '../../api/movieApi';
import { useWatchlistStore } from '../../store/watchlistStore';
import { Pill } from '../../components/Pill/Pill';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Route = RouteProp<any, 'Detail'>; // should repace wth apt. types
type Nav = NativeStackNavigationProp<any>; // should repace wth apt. types

const { width } = Dimensions.get('window');

export default function DetailScreen() {
  const route: any = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { movieId, movie: preloaded } = route.params;

  const [movie, setMovie] = useState<Movie | null>(preloaded ?? null);
  const [loading, setLoading] = useState(!preloaded);

  const { add, remove, contains } = useWatchlistStore();
  const inWatchlist = movie ? contains(movie.id) : false;

  useEffect(() => {
    movieApi
      .detail(movieId)
      .then(setMovie)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [movieId]);

  const toggleWatchlist = useCallback(() => {
    if (!movie) return;
    if (inWatchlist) remove(movie.id);
    else add(movie);
  }, [movie, inWatchlist, add, remove]);

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  if (loading && !movie) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.accent} size="large" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>unable to load.</Text>
      </View>
    );
  }

  const backdrop = getBackdropUrl(movie.backdrop_path ?? '');
  const poster = getPosterUrl(movie.poster_path ?? '', 'w342');
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '';
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : '';

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/*  top section*/}
      <TouchableOpacity style={styles.backBtn} onPress={goBack}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={16}
          color={Colors.accent}
        />
      </TouchableOpacity>
      {/* body section */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* -BackdropSection */}
        <View style={styles.backdropContainer}>
          {backdrop ? (
            <Image
              source={{ uri: backdrop }}
              style={styles.backdrop}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.backdrop,
                { backgroundColor: Colors.surfaceElevated },
              ]}
            />
          )}
          <View style={styles.backdropOverlay} />
        </View>

        <View style={styles.content}>
          {/* pster*/}
          <View style={styles.heroRow}>
            <View style={styles.posterShadow}>
              {poster ? (
                <Image
                  source={{ uri: poster }}
                  style={styles.poster}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.poster, styles.posterPlaceholder]}>
                  <Text style={{ color: Colors.textMuted, fontSize: 32 }}>
                    {movie.title[0]}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.titleBlock}>
              <Text style={styles.title}>{movie.title}</Text>
              {movie.tagline ? (
                <Text style={styles.tagline}>{movie.tagline}</Text>
              ) : null}
              <View style={styles.metaRow}>
                {year && <Pill label={year} variant="outlined" />}
                {runtime && <Pill label={runtime} variant="outlined" />}
                {movie.vote_average > 0 && (
                  <Pill
                    label={`★ ${movie.vote_average.toFixed(1)}`}
                    variant="outlined"
                    color={Colors.accent}
                  />
                )}
              </View>
            </View>
          </View>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <View style={styles.genreRow}>
              {movie.genres.map(g => (
                <Pill key={g.id} label={g.name} />
              ))}
            </View>
          )}

          {/* Synopsis */}
          {movie.overview ? (
            <View style={styles.synopsisBlock}>
              <Text style={styles.synopsisLabel}>SYNOPSIS</Text>
              <Text style={styles.synopsis}>{movie.overview}</Text>
            </View>
          ) : null}

          {/* Watchlist button */}
          <TouchableOpacity
            style={[
              styles.watchlistBtn,
              inWatchlist && styles.watchlistBtnActive,
            ]}
            onPress={toggleWatchlist}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.watchlistBtnText,
                inWatchlist && styles.watchlistBtnTextActive,
              ]}
            >
              {inWatchlist ? '✓  In Watchlist' : '+  Add to Watchlist'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorText: { color: Colors.textMuted },
  backBtn: {
    position: 'absolute',
    top: 22,
    left: Spacing.md,
    zIndex: 10,
    backgroundColor: 'rgba(10,10,15,0.7)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
  },
  backText: { color: Colors.accent, fontSize: 13, fontWeight: '600' },
  backdropContainer: { width, height: 240, position: 'relative' },
  backdrop: { width: '100%', height: '100%' },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: 'rgba(10,10,15,0.5)',
  },
  content: { padding: Spacing.md, marginTop: -40 },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
  },
  posterShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
    borderRadius: Radius.md,
  },
  poster: { width: 110, height: 165, borderRadius: Radius.md },
  posterPlaceholder: {
    backgroundColor: Colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBlock: { flex: 1, marginLeft: Spacing.md, paddingBottom: 4 },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 26,
  },
  tagline: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: Spacing.sm },
  metaChip: {
    fontSize: 11,
    color: Colors.textMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 6,
    fontWeight: '600',
  },
  ratingChip: { color: Colors.accent, borderColor: Colors.accentDim },
  genreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.md,
  },
  genrePill: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  genrePillText: { color: Colors.textMuted, fontSize: 11, fontWeight: '600' },
  synopsisBlock: { marginBottom: Spacing.xl },
  synopsisLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.textFaint,
    marginBottom: Spacing.xs + 2,
  },
  synopsis: { fontSize: 14, color: Colors.text, lineHeight: 22, opacity: 0.85 },
  watchlistBtn: {
    borderWidth: 1.5,
    borderColor: Colors.accent,
    borderRadius: Radius.full,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  watchlistBtnActive: {
    backgroundColor: Colors.accent,
  },
  watchlistBtnText: {
    color: Colors.accent,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  watchlistBtnTextActive: { color: Colors.background },
});
