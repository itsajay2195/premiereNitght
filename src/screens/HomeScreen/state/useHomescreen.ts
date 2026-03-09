import { useReducer, useEffect, useCallback } from 'react';
import { movieApi } from '../../../api/movieApi';
import { Movie, Genre } from '../../../api/types/movie';
import { showToast } from '../../../utils/toast';

interface HomeState {
  nowPlaying: Movie[];
  popular: Movie[];
  genres: Genre[];
  genreMovies: Movie[];
  searchResults: Movie[];
  selectedGenre: number | null;
  searchQuery: string;
  loading: boolean;
  searching: boolean;
  refreshing: boolean;
  isError: boolean;
}

type HomeAction =
  | { type: 'LOAD_START' }
  | {
      type: 'LOAD_SUCCESS';
      payload: { nowPlaying: Movie[]; popular: Movie[]; genres: Genre[] };
    }
  | { type: 'LOAD_ERROR' }
  | { type: 'REFRESH_START' }
  | { type: 'REFRESH_DONE' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SEARCH_RESULTS'; payload: Movie[] }
  | { type: 'SET_SEARCHING'; payload: boolean }
  | { type: 'SET_SELECTED_GENRE'; payload: number | null }
  | { type: 'SET_GENRE_MOVIES'; payload: Movie[] };

const initialState: HomeState = {
  nowPlaying: [],
  popular: [],
  genres: [],
  genreMovies: [],
  searchResults: [],
  selectedGenre: null,
  searchQuery: '',
  loading: true,
  searching: false,
  refreshing: false,
  isError: false,
};

function homeReducer(state: HomeState, action: HomeAction): HomeState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, isError: false };
    case 'LOAD_SUCCESS':
      return { ...state, loading: false, isError: false, ...action.payload };
    case 'LOAD_ERROR':
      showToast.error('Failed to load films.');
      return { ...state, loading: false, isError: true };
    case 'REFRESH_START':
      return { ...state, refreshing: true };
    case 'REFRESH_DONE':
      return { ...state, refreshing: false };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'SET_SEARCHING':
      return { ...state, searching: action.payload };
    case 'SET_SELECTED_GENRE':
      return { ...state, selectedGenre: action.payload };
    case 'SET_GENRE_MOVIES':
      return { ...state, genreMovies: action.payload };
    default:
      return state;
  }
}

export function useHomeScreen() {
  const [state, dispatch] = useReducer(homeReducer, initialState);

  const loadHome = useCallback(async () => {
    try {
      const [np, pop, gen] = await Promise.all([
        movieApi.nowPlaying(),
        movieApi.popular(),
        movieApi.genres(),
      ]);
      dispatch({
        type: 'LOAD_SUCCESS',
        payload: {
          nowPlaying: np.results.slice(0, 15),
          popular: pop.results.slice(0, 15),
          genres: gen.genres,
        },
      });
    } catch (e) {
      dispatch({ type: 'LOAD_ERROR' });
      console.error(e);
    } finally {
      dispatch({ type: 'REFRESH_DONE' });
    }
  }, []);

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  useEffect(() => {
    if (!state.selectedGenre) {
      dispatch({ type: 'SET_GENRE_MOVIES', payload: [] });
      return;
    }
    movieApi
      .discover(state.selectedGenre)
      .then(r =>
        dispatch({ type: 'SET_GENRE_MOVIES', payload: r.results.slice(0, 15) }),
      );
  }, [state.selectedGenre]);

  useEffect(() => {
    if (!state.searchQuery.trim()) {
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
      return;
    }
    const timer = setTimeout(async () => {
      dispatch({ type: 'SET_SEARCHING', payload: true });
      try {
        const r = await movieApi.search(state.searchQuery.trim());
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: r.results });
      } catch {
        showToast.error('Search failed.');
      } finally {
        dispatch({ type: 'SET_SEARCHING', payload: false });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [state.searchQuery]);

  const onRefresh = useCallback(() => {
    dispatch({ type: 'REFRESH_START' });
    loadHome();
  }, [loadHome]);

  const setSearchQuery = (query: string) =>
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });

  const setSelectedGenre = (id: number | null) =>
    dispatch({ type: 'SET_SELECTED_GENRE', payload: id });

  return { state, onRefresh, setSearchQuery, setSelectedGenre };
}
