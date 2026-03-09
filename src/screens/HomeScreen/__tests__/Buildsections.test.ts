import { buildSections } from '../state/buildSections';
import { Movie, Genre } from '../../../api/types/movie';

// below is the mock data
const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  poster_path: '/test.jpg',
  backdrop_path: '/backdrop.jpg',
  overview: 'Test overview',
  release_date: '2024-01-01',
  vote_average: 7.5,
  vote_count: 100,
  genre_ids: [28],
};

const mockGenre: Genre = { id: 28, name: 'Action' };

const defaultParams = {
  isSearching: false,
  showGenreResults: false,
  searchQuery: '',
  searching: false,
  searchResults: [],
  genres: [mockGenre],
  selectedGenre: null,
  genreMovies: [],
  nowPlaying: [mockMovie],
  popular: [mockMovie],
  loading: false,
  isError: false,
};

describe('buildSections', () => {
  describe('default state', () => {
    it('returns nowPlaying and popular sections', () => {
      const sections = buildSections(defaultParams);

      expect(sections).toHaveLength(2);
      expect(sections[0].id).toBe('nowPlaying');
      expect(sections[1].id).toBe('popular');
    });

    it('nowPlaying section has correct config', () => {
      const sections = buildSections(defaultParams);
      const nowPlaying = sections.find(s => s.id === 'nowPlaying');

      expect(nowPlaying).toMatchObject({
        id: 'nowPlaying',
        title: 'Now Playing',
        orientation: 'horizontal',
        size: 'lg',
        data: [mockMovie],
        emptyMessage: 'Failed to load films.',
      });
    });

    it('popular section has correct config', () => {
      const sections = buildSections(defaultParams);
      const popular = sections.find(s => s.id === 'popular');

      expect(popular).toMatchObject({
        id: 'popular',
        title: 'Popular',
        orientation: 'horizontal',
        size: 'md',
        data: [mockMovie],
      });
    });
  });

  describe('loading state', () => {
    it('passes loading state to nowPlaying and popular sections', () => {
      const sections = buildSections({ ...defaultParams, loading: true });

      sections.forEach(section => {
        expect(section.isLoading).toBe(true);
      });
    });
  });

  describe('error state', () => {
    it('passes error state to nowPlaying and popular sections', () => {
      const sections = buildSections({ ...defaultParams, isError: true });

      sections.forEach(section => {
        expect(section.isError).toBe(true);
      });
    });
  });

  describe('searching', () => {
    it('returns only search section when isSearching is true', () => {
      const sections = buildSections({
        ...defaultParams,
        isSearching: true,
        searchQuery: 'batman',
        searchResults: [mockMovie],
      });

      expect(sections).toHaveLength(1);
      expect(sections[0].id).toBe('search');
    });

    it('shows results title when not actively searching', () => {
      const sections = buildSections({
        ...defaultParams,
        isSearching: true,
        searching: false,
        searchQuery: 'batman',
        searchResults: [mockMovie],
      });

      expect(sections[0].title).toBe('Results for "batman"');
    });

    it('shows searching title when actively searching', () => {
      const sections = buildSections({
        ...defaultParams,
        isSearching: true,
        searching: true,
        searchQuery: 'batman',
      });

      expect(sections[0].title).toBe('Searching...');
    });

    it('passes search results as data', () => {
      const sections = buildSections({
        ...defaultParams,
        isSearching: true,
        searchQuery: 'batman',
        searchResults: [mockMovie],
      });

      expect(sections[0].data).toEqual([mockMovie]);
    });

    it('search section has correct empty message', () => {
      const sections = buildSections({
        ...defaultParams,
        isSearching: true,
        searchQuery: 'batman',
        searchResults: [],
      });

      expect(sections[0].emptyMessage).toBe('No films found.');
    });
  });

  describe('genre filter', () => {
    it('includes genre section when showGenreResults is true', () => {
      const sections = buildSections({
        ...defaultParams,
        showGenreResults: true,
        selectedGenre: 28,
        genreMovies: [mockMovie],
      });

      expect(sections).toHaveLength(3);
      expect(sections[0].id).toBe('genre');
    });

    it('genre section title matches selected genre name', () => {
      const sections = buildSections({
        ...defaultParams,
        showGenreResults: true,
        selectedGenre: 28,
        genres: [mockGenre],
        genreMovies: [mockMovie],
      });

      expect(sections[0].title).toBe('Action');
    });

    it('genre section title is empty string when genre not found', () => {
      const sections = buildSections({
        ...defaultParams,
        showGenreResults: true,
        selectedGenre: 999, // non-existent genre
        genres: [mockGenre],
      });

      expect(sections[0].title).toBe('');
    });

    it('does not include genre section when showGenreResults is false', () => {
      const sections = buildSections({
        ...defaultParams,
        showGenreResults: false,
      });

      expect(sections.find(s => s.id === 'genre')).toBeUndefined();
    });
  });
});
