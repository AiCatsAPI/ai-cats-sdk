import { CatInfo, SearchResult, Size, Theme } from '../models';
import { MediaType } from '../models/enums/type.enum';

const ApiUrl = 'https://api.ai-cats.net/v2';

/** Response type for media requests */
export type ResponseType = 'blob' | 'arrayBuffer' | 'base64' | 'dataUrl';

/** Media response based on responseType */
export type MediaResponse<T extends ResponseType = 'blob'> = T extends 'blob'
  ? Blob
  : T extends 'arrayBuffer'
    ? ArrayBuffer
    : T extends 'base64'
      ? string
      : T extends 'dataUrl'
        ? string
        : Blob;

/** Convert ArrayBuffer to desired response type */
async function toResponseType<T extends ResponseType>(
  buffer: ArrayBuffer,
  mediaType: MediaType = MediaType.Image,
  type: T = 'blob' as T,
): Promise<MediaResponse<T>> {
  switch (type) {
    case 'arrayBuffer':
      return buffer as MediaResponse<T>;
    case 'base64': {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary) as MediaResponse<T>;
    }
    case 'dataUrl': {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const mimeType = mediaType === MediaType.Video ? 'video/mp4' : 'image/jpeg';
      return `data:${mimeType};base64,${btoa(binary)}` as MediaResponse<T>;
    }
    case 'blob':
    default:
      const mimeType = mediaType === MediaType.Video ? 'video/mp4' : 'image/jpeg';
      return new Blob([buffer], { type: mimeType }) as MediaResponse<T>;
  }
}

/** Options for getting a random cat */
export interface RandomCatOptions<T extends ResponseType = 'blob'> {
  /** Media size (default: Large) */
  size?: Size;
  /** Theme of the cat media */
  theme?: Theme;
  /** Filter by media type */
  type?: MediaType;
  /** Response format (default: blob) */
  responseType?: T;
}

/** Options for getting bulk random cats */
export interface RandomBulkCatOptions {
  /** Media size (default: Large) */
  size?: Size;
  /** Theme of the cat media */
  theme?: Theme;
  /** Filter by media type */
  type?: MediaType;
  /** Maximum number of results (1-100, default: 10) */
  limit?: number;
}

/** Options for searching cats */
export interface SearchOptions {
  /** Search query (e.g., "orange fluffy cat") */
  query?: string;
  /** Maximum number of results (1-100, default: 10) */
  limit?: number;
  /** Pagination cursor - ID to start from */
  from?: string;
  /** Sort by newest first */
  descending?: boolean;
  /** Filter by theme */
  theme?: Theme;
  /** Media size in results */
  size?: Size;
  /** Filter by media type */
  type?: MediaType;
}

/** Options for similar cats */
export interface SimilarOptions {
  /** Maximum number of results (1-100, default: 10) */
  limit?: number;
  /** Media size in results */
  size?: Size;
}

/** Options for getting a cat by ID */
export interface GetByIdOptions<T extends ResponseType = 'blob'> {
  /** Media size (default: Large) */
  size?: Size;
  /** media type */
  type?: MediaType;
  /** Response format (default: blob) */
  responseType?: T;
}

export interface CountOptions {
  /** Filter by theme */
  theme?: Theme;
  /** Filter by media type */
  type?: MediaType;
}

/**
 * Get a random AI-generated cat media
 * @param options - Optional size, theme, and responseType settings
 * @returns Media in the specified format (default: Blob)
 * @example
 * const blob = await AiCats.random({ theme: Theme.Halloween });
 * const base64 = await AiCats.random({ responseType: 'base64' });
 * const dataUrl = await AiCats.random({ responseType: 'dataUrl' });
 */
async function random<T extends ResponseType = 'blob'>(options?: RandomCatOptions<T>): Promise<MediaResponse<T>> {
  const params = new URLSearchParams();
  if (options?.size) params.set('size', options.size);
  if (options?.theme) params.set('theme', options.theme);
  if (options?.type) params.set('type', options.type);
  params.set('rnd', Math.random().toString()); // Prevent caching
  const query = params.toString() ? `?${params}` : '';

  const response = await fetch(`${ApiUrl}/cats/random${query}`);
  if (!response.ok) {
    throw new Error(`Error fetching cat media: ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  return toResponseType(buffer, options?.type, options?.responseType ?? ('blob' as T));
}

/**
 * Get a bulk of random AI-generated cat media
 * @param options - Optional bulk request options
 * @returns Array of search results with IDs and URLs
 * @example
 * const info = await AiCats.randomBulk({ limit: 5, theme: Theme.Halloween });
 * console.log(info); // [{ id: '...', url: '...', blurHash: '...', type: '...' }, ...]
 */
async function randomBulk(options?: RandomBulkCatOptions): Promise<SearchResult> {
  const params = new URLSearchParams();
  if (options?.size) params.set('size', options.size);
  if (options?.theme) params.set('theme', options.theme);
  if (options?.type) params.set('type', options.type);
  if (options?.limit) params.set('limit', options.limit.toString());
  const query = params.toString() ? `?${params}` : '';

  const response = await fetch(`${ApiUrl}/cats/random/bulk${query}`);
  if (!response.ok) {
    throw new Error(`Error fetching bulk cat media: ${response.statusText}`);
  }
  return response.json();
}


/**
 * Get a specific cat media by ID
 * @param id - The unique cat media ID
 * @param options - Optional size and responseType settings
 * @returns Media in the specified format (default: Blob)
 * @example
 * const blob = await AiCats.getById('669de24a-1da1-4fcd-84b1-9e55a43a0e0e');
 * const base64 = await AiCats.getById('669de24a-1da1-4fcd-84b1-9e55a43a0e0e', { responseType: 'base64' });
 */
async function getById<T extends ResponseType = 'blob'>(
  id: string,
  options?: GetByIdOptions<T>,
): Promise<MediaResponse<T>> {
  const size = options?.size ?? Size.Large;
  const suffix = options?.type === MediaType.Video ? '.mp4' : '.jpg';
  const response = await fetch(`${ApiUrl}/cat/${id}${suffix}?size=${size}`);
  if (!response.ok) {
    throw new Error(`Error fetching cat media: ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  return toResponseType(buffer, options?.type, options?.responseType ?? ('blob' as T));
}

/**
 * Get detailed information about a cat media
 * @param id - The unique cat media ID
 * @returns Cat info including prompt, theme, and creation date
 * @example
 * const info = await AiCats.getInfo('669de24a-1da1-4fcd-84b1-9e55a43a0e0e');
 * console.log(info.prompt); // "In a futuristic space observatory..."
 */
async function getInfo(id: string): Promise<CatInfo> {
  const response = await fetch(`${ApiUrl}/cats/${id}/info`);
  if (!response.ok) {
    throw new Error(`Error fetching cat info: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Search for cat media
 * @param options - Search options including query, limit, theme, etc.
 * @returns Array of search results with IDs and URLs
 * @example
 * const cats = await AiCats.search({ query: 'space tiger', limit: 5 });
 */
async function search(options: SearchOptions = {}): Promise<SearchResult[]> {
  const params = new URLSearchParams();
  if (options.query) params.set('query', options.query);
  if (options.limit) params.set('limit', options.limit.toString());
  if (options.from) params.set('from', options.from);
  if (options.descending) params.set('descending', 'true');
  if (options.theme) params.set('theme', options.theme);
  if (options.size) params.set('size', options.size);
  if (options.type) params.set('type', options.type);
  const query = params.toString() ? `?${params}` : '';

  const response = await fetch(`${ApiUrl}/cats/search${query}`);
  if (!response.ok) {
    throw new Error(`Error searching for cats: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Find cats similar to a given cat
 * @param id - The cat ID to find similar cats for
 * @param options - Optional limit and size settings
 * @returns Array of similar cat results
 * @example
 * const similar = await AiCats.getSimilar('669de24a-1da1-4fcd-84b1-9e55a43a0e0e', { limit: 5 });
 */
async function getSimilar(id: string, options?: SimilarOptions): Promise<SearchResult[]> {
  const params = new URLSearchParams();
  if (options?.limit) params.set('limit', options.limit.toString());
  if (options?.size) params.set('size', options.size);
  const query = params.toString() ? `?${params}` : '';

  const response = await fetch(`${ApiUrl}/cats/${id}/similar${query}`);
  if (!response.ok) {
    throw new Error(`Error fetching similar cats: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get search completion/suggestion
 * @param options - Search options
 * @returns A completion string suggestion
 */
async function getSearchCompletion(options: SearchOptions = {}): Promise<string> {
  const params = new URLSearchParams();
  if (options.query) params.set('query', options.query);
  if (options.limit) params.set('limit', options.limit.toString());
  if (options.from) params.set('from', options.from);
  if (options.descending) params.set('descending', 'true');
  if (options.theme) params.set('theme', options.theme);
  if (options.size) params.set('size', options.size);
  if (options.type) params.set('type', options.type);
  const query = params.toString() ? `?${params}` : '';

  const response = await fetch(`${ApiUrl}/cats/search-completion${query}`);
  if (!response.ok) {
    throw new Error(`Error fetching completion: ${response.statusText}`);
  }
  const data = await response.json();
  return data.completion;
}

/**
 * Get all available themes
 * @returns Array of theme names
 * @example
 * const themes = await AiCats.getThemes();
 * // ['Default', 'Halloween', 'Xmas', ...]
 */
async function getThemes(): Promise<Theme[]> {
  const response = await fetch(`${ApiUrl}/themes`);
  if (!response.ok) {
    throw new Error(`Error fetching themes: ${response.statusText}`);
  }
  const data = await response.json();
  return data.themes;
}

/**
 * Get the total count of cat media
 * @param options - Count Options
 * @returns Total number of cat images/videos
 * @example
 * const total = await AiCats.getCount();
 * const halloweenCount = await AiCats.getCount(Theme.Halloween);
 */
async function getCount(options: CountOptions = {}): Promise<number> {
  const params = new URLSearchParams();
  if (options.theme) params.set('theme', options.theme);
  if (options.type) params.set('type', options.type);
  const query = params.toString() ? `?${params}` : '';

  const response = await fetch(`${ApiUrl}/cats/count${query}`);
  if (!response.ok) {
    throw new Error(`Error fetching count: ${response.statusText}`);
  }
  const data = await response.json();
  return data.count;
}

export const AiCatsAPI = {
  random,
  randomBulk,
  getById,
  getInfo,
  search,
  getSimilar,
  getSearchCompletion,
  getThemes,
  getCount,
};
