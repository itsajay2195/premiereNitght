import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createMMKV, MMKV } from 'react-native-mmkv';
import { Movie } from '../api/types/movie';

const storage: MMKV = createMMKV({ id: 'premiere-watchlist' });

const mmkvAdapter = {
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value ?? null;
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.remove(key);
  },
};

interface WatchlistState {
  items: Movie[];
  add: (movie: Movie) => void;
  remove: (id: number) => void;
  contains: (id: number) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: movie =>
        set(state => ({
          items: state.items.some(m => m.id === movie.id)
            ? state.items
            : [movie, ...state.items],
        })),
      remove: id =>
        set(state => ({ items: state.items.filter(m => m.id !== id) })),
      contains: id => get().items.some(m => m.id === id),
    }),
    {
      name: 'premiere-watchlist',
      storage: createJSONStorage(() => mmkvAdapter),
    },
  ),
);
