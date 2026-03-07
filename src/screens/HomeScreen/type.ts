import { Movie } from '../../api/types/movie';

type SectionOrientation = 'horizontal' | 'vertical';
export interface Section {
  id: string;
  title: string;
  data: Movie[];
  orientation: SectionOrientation;
  size: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isError?: boolean;
  emptyMessage?: string;
}
