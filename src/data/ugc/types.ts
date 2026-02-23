import { ImageSourcePropType } from 'react-native';

export interface UgcPost {
  id: string;
  imageSource: ImageSourcePropType;
  caption: string;
  authorName: string;
  date: string;
  platform: string;
  sourceUrl: string;
}
