import { ImageSourcePropType } from 'react-native';

export type StratosImage = {
  id: string;
  src: ImageSourcePropType;
};

export const STRATOS_IMAGES: StratosImage[] = [
  { id: 'cow-main', src: require('../../assets/stratos/stratos-cow.png') },
  { id: 'stratos-1', src: require('../../assets/stratos/stratoskua (1).jpg') },
  { id: 'stratos-2', src: require('../../assets/stratos/stratoskua (2).jpg') },
  { id: 'stratos-3', src: require('../../assets/stratos/stratoskua (3).jpg') },
  { id: 'stratos-4', src: require('../../assets/stratos/stratoskua (4).jpg') },
  { id: 'stratos-5', src: require('../../assets/stratos/stratoskua (5).jpg') },
  { id: 'stratos-6', src: require('../../assets/stratos/stratoskua (6).jpg') },
  { id: 'stratos-7', src: require('../../assets/stratos/stratoskua (7).jpg') },
];
