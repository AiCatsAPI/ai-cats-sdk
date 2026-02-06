import { CatInfo, SearchResult, Size, Theme } from '../models';

const ApiUrl = 'https://api.ai-cats.net/v1';

/** Options for getting a random cat */
export interface RandomCatOptions {
  /** Image size (default: Large) */
  size?: Size;
  /** Theme of the cat image */
  theme?: Theme;
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
  /** Image size in results */
  size?: Size;
}

/** Options for similar cats */
export interface SimilarOptions {
  /** Maximum number of results (1-100, default: 10) */
  limit?: number;
  /** Image size in results */
  size?: Size;
}

/**
 * Get a random AI-generated cat image
 * @param options - Optional size and theme settings
 * @returns A Blob containing the JPEG image
 * @example
 * const imageBlob = await AiCats.random({ theme: Theme.Halloween });
 */
async function random(options?: RandomCatOptions): Promise<Blob> {
  const params = new URLSearchParams();
  if (options?.size) params.set('size', options.size);
  if (options?.theme) params.set('theme', options.theme);
  const query = params.toString() ? `?${params}` : '';

  const response = await fetch(`${ApiUrl}/cat${query}`);
  if (!response.ok) {
    throw new Error(`Error fetching cat image: ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  return new Blob([buffer], { type: 'image/jpeg' });
}

/**
 * Get a specific cat image by ID
 * @param id - The unique cat image ID
 * @param size - Image size (default: Large)
 * @returns A Blob containing the JPEG image
 * @example
 * const imageBlob = await AiCats.getById('669de24a-1da1-4fcd-84b1-9e55a43a0e0e', Size.Medium);
 */
async function getById(id: string, size: Size = Size.Large): Promise<Blob> {
  const response = await fetch(`${ApiUrl}/cat/${id}?size=${size}`);
  if (!response.ok) {
    throw new Error(`Error fetching cat image: ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  return new Blob([buffer], { type: 'image/jpeg' });
}

/**
 * Get detailed information about a cat image
 * @param id - The unique cat image ID
 * @returns Cat info including prompt, theme, and creation date
 * @example
 * const info = await AiCats.getInfo('669de24a-1da1-4fcd-84b1-9e55a43a0e0e');
 * console.log(info.prompt); // "In a futuristic space observatory..."
 */
async function getInfo(id: string): Promise<CatInfo> {
  const response = await fetch(`${ApiUrl}/cat/info/${id}`);
  if (!response.ok) {
    throw new Error(`Error fetching cat info: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Search for cat images
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
  const query = params.toString() ? `?${params}` : '';

  const response = await fetch(`${ApiUrl}/cat/search${query}`);
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

  const response = await fetch(`${ApiUrl}/cat/similar/${id}${query}`);
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
  const query = params.toString() ? `?${params}` : '';

  const response = await fetch(`${ApiUrl}/cat/search-completion${query}`);
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
async function getThemes(): Promise<string[]> {
  const response = await fetch(`${ApiUrl}/cat/themes`);
  if (!response.ok) {
    throw new Error(`Error fetching themes: ${response.statusText}`);
  }
  const data = await response.json();
  return data.themes;
}

/**
 * Get the total count of cat images
 * @param theme - Optional theme to filter by
 * @returns Total number of cat images
 * @example
 * const total = await AiCats.getCount();
 * const halloweenCount = await AiCats.getCount(Theme.Halloween);
 */
async function getCount(theme?: Theme): Promise<number> {
  const response = await fetch(`${ApiUrl}/cat/count${theme ? `?theme=${theme}` : ''}`);
  if (!response.ok) {
    throw new Error(`Error fetching count: ${response.statusText}`);
  }
  const data = await response.json();
  return data.count;
}

export const V1Api = {
  random,
  getById,
  getInfo,
  search,
  getSimilar,
  getSearchCompletion,
  getThemes,
  getCount,
};
