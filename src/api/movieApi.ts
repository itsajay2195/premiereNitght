import { get } from './httpClient';
import { GenresResponse, Movie, MoviesResponse } from './types/movie';

export const movieApi = {
  nowPlaying: (page = 1) =>
    get<MoviesResponse>('/movie/now_playing', { page: String(page) }),

  popular: (page = 1) =>
    get<MoviesResponse>('/movie/popular', { page: String(page) }),

  topRated: (page = 1) =>
    get<MoviesResponse>('/movie/top_rated', { page: String(page) }),

  search: (query: string, page = 1) =>
    get<MoviesResponse>('/search/movie', { query, page: String(page) }),

  detail: (id: number) => get<Movie>(`/movie/${id}`),

  genres: () => get<GenresResponse>('/genre/movie/list'),

  discover: (genreId: number, page = 1) =>
    get<MoviesResponse>('/discover/movie', {
      with_genres: String(genreId),
      page: String(page),
      sort_by: 'popularity.desc',
    }),
};
