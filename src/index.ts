import { AiCatsAPI } from './api';

// Main SDK export
export const AiCats = AiCatsAPI;

// Types for SDK users
export type { CatInfo, SearchResult } from './models';
export type { RandomCatOptions, SearchOptions, SimilarOptions, CountOptions, GetByIdOptions } from './api';

// Enums for SDK users
export { Size, Theme, MediaType } from './models';
