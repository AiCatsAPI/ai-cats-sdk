import { Theme } from '../enums/theme.enum';
import { MediaType } from '../enums/type.enum';

/**
 * Detailed information about a cat media
 */
export interface CatInfo {
  /** Unique identifier for the cat media */
  id: string;
  /** URL to access the cat media */
  url: string;
  /** BlurHash interpretation of the image */
  blurHash: string;
  /** Unix timestamp when the media was created */
  dateCreated: number;
  /** The AI prompt used to generate this cat media */
  prompt: string;
  /** The theme of the cat media */
  theme: Theme;
  /** The type of media */
  type: MediaType;
}
