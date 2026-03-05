import { TMDB_API_KEY } from '../../config';
import { BASE_URL } from '../constants/apiConstants';

const API_KEY = TMDB_API_KEY;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function get<T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<T> {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    ...params,
  }).toString();

  const url = `${BASE_URL}${endpoint}?${queryParams}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new ApiError(res.status, `TMDb error ${res.status}: ${endpoint}`);
  }

  return res.json() as Promise<T>;
}
