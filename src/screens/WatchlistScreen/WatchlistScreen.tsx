import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useWatchlistStore } from '../../store/watchlistStore';
import { Movie } from '../../api/types/movie';
import { Colors, Radius, Spacing } from '../../theme/theme';
import { getPosterUrl } from '../../utils/image';
import { DETAILS_SCREEN } from '../../constants/screens';
import { Typography } from '../../components/Typography';

type Nav = NativeStackNavigationProp<any>;

export default function WatchlistScreen() {
  const { items, remove } = useWatchlistStore();
  const navigation = useNavigation<Nav>();

  const goToDetail = useCallback(
    (movie: Movie) => {
      navigation.navigate(DETAILS_SCREEN, { movieId: movie.id, movie });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Movie }) => {
      return (
        <WatchlistRow
          movie={item}
          onPress={() => goToDetail(item)}
          onRemove={() => remove(item.id)}
        />
      );
    },
    [goToDetail, remove],
  );
  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography variant="heading">WATCHLIST</Typography>
          <Typography variant="caption" color={Colors.textMuted}>
            {items.length} {items.length === 1 ? 'film' : 'films'}
          </Typography>
        </View>
        {items.length === 0 ? (
          <View style={styles.empty}>
            <Typography variant="heading">🎬</Typography>
            <Typography variant="title" style={styles.emptyTitle}>
              Your watchlist is empty
            </Typography>
            <Typography
              variant="body"
              color={Colors.textMuted}
              style={styles.emptySubtitle}
            >
              Add films from the home screen to curate your premiere night
              lineup.
            </Typography>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
    </View>
  );
}

function WatchlistRow({
  movie,
  onPress,
  onRemove,
}: {
  movie: Movie;
  onPress: () => void;
  onRemove: () => void;
}) {
  const uri = getPosterUrl(movie.poster_path ?? '', 'w185');
  const year = movie.release_date?.slice(0, 4) ?? '';
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.75}>
      {uri ? (
        <Image source={{ uri }} style={styles.thumb} resizeMode="cover" />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder]}>
          <Typography variant="caption" color={Colors.textMuted}>
            {movie.title[0]}
          </Typography>
        </View>
      )}
      <View style={styles.rowInfo}>
        <Typography variant="title" numberOfLines={2}>
          {movie.title}
        </Typography>
        {year ? <Typography variant="caption">{year}</Typography> : null}
        {movie.vote_average > 0 && (
          <Typography variant="caption" color={Colors.accent}>
            ★ {movie.vote_average.toFixed(1)}
          </Typography>
        )}
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={onRemove}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Typography variant="caption" color={Colors.danger}>
          Remove
        </Typography>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  logo: {
    fontSize: 20,
    fontWeight: '300',
    letterSpacing: 6,
    color: Colors.text,
    fontStyle: 'italic',
  },
  count: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyTitle: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  list: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  thumb: { width: 56, height: 84, borderRadius: Radius.sm },
  thumbPlaceholder: {
    backgroundColor: Colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowInfo: { flex: 1, marginHorizontal: Spacing.md },
  rowTitle: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
    lineHeight: 20,
  },
  rowYear: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  rowRating: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '700',
    marginTop: 2,
  },
  separator: { height: 1, backgroundColor: Colors.border, marginLeft: 80 },
  removeBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: Radius.full,
  },
  removeBtnText: { color: Colors.danger, fontSize: 11, fontWeight: '600' },
});
