import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { getPosterUrl } from '../../../utils/imageUtils';
import { Movie } from '../../../api/types/movie';
import { Colors, Radius, Spacing } from '../../../theme/theme';
import { Typography } from '../../../components/Typography/Typography';

const CARD_WIDTH = 140;
const CARD_HEIGHT = 210;

interface Props {
  movie: Movie;
  onPress: (movie: Movie) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function MovieCard({ movie, onPress, size = 'md' }: Props) {
  const width = size === 'sm' ? 110 : size === 'lg' ? 180 : CARD_WIDTH;
  const height = size === 'sm' ? 165 : size === 'lg' ? 270 : CARD_HEIGHT;

  const uri = getPosterUrl(movie.poster_path ?? '', 'w342');

  return (
    <TouchableOpacity
      style={[styles.card, { width, height }]}
      onPress={() => onPress(movie)}
      activeOpacity={0.75}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.poster} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Typography variant="heading" color={Colors.textMuted}>
            {movie.title[0]}
          </Typography>
        </View>
      )}
      <View style={styles.overlay}>
        <Typography variant="title" numberOfLines={2}>
          {movie.title}
        </Typography>
        {movie.vote_average > 0 && (
          <Typography variant="caption" color={Colors.accent}>
            ★ {movie.vote_average.toFixed(1)}
          </Typography>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceElevated,
    marginRight: Spacing.sm,
  },
  poster: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated,
  },
  placeholderText: {
    fontSize: 36,
    color: Colors.textMuted,
    fontWeight: '300',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.sm,
    backgroundColor: 'rgba(10,10,15,0.85)',
  },
  title: {
    color: Colors.text,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    lineHeight: 14,
  },
  rating: {
    color: Colors.accent,
    fontSize: 10,
    marginTop: 2,
    fontWeight: '700',
  },
});
