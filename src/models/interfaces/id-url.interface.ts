import { Type } from '../enums/type.enum';

/**
 * A search result containing a cat media ID and URL
 */
export interface SearchResult {
  /** Unique identifier for the cat media */
  id: string;
  /** Direct URL to the cat media */
  url: string;
  /** The type of media */
  type: Type;
}
