import { V1Api } from './api';

// Main SDK export
export const AiCats = V1Api;

// Types for SDK users
export type { CatInfo, SearchResult } from './models';
export type { RandomCatOptions, SearchOptions, SimilarOptions } from './api/v1.api';

// Enums for SDK users
export { Size, Theme } from './models';
