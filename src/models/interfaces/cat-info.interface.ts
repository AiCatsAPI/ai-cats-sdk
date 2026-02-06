import { Theme } from '../enums/theme.enum';

/**
 * Detailed information about a cat image
 */
export interface CatInfo {
  /** Unique identifier for the cat image */
  id: string;
  /** Unix timestamp when the image was created */
  dateCreated: number;
  /** The AI prompt used to generate this cat image */
  prompt: string;
  /** The theme of the cat image */
  theme: Theme;
}
