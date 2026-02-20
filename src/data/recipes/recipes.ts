import { Recipe } from './types';

export const recipes: Recipe[] = [
  {
    id: 'midnight-cocoa',
    title: 'Midnight Cocoa',
    timeLabel: '30 sec',
    shortDescription: 'Rich cocoa with a whipped finish.',
    steps: ['Warm milk in a mug.', 'Stir in cocoa mix.', 'Top with a cloud of foam.'],
    tip: 'Finish with a pinch of sea salt.',
    productRefs: [
      { type: 'name', value: 'cocoa' },
      { type: 'name', value: 'milk' },
    ],
  },
  {
    id: 'quick-cookies',
    title: 'Quick Cookie Crumble',
    timeLabel: '2 min',
    shortDescription: 'Warm cookie bits over chilled cream.',
    steps: ['Crumble cookies into a cup.', 'Add cold cream.', 'Spoon over cocoa drizzle.'],
    tip: 'Use a wide glass for maximum texture.',
    productRefs: [
      { type: 'name', value: 'cookie' },
      { type: 'name', value: 'cream' },
    ],
  },
  {
    id: 'strawberry-swirl',
    title: 'Strawberry Swirl Shake',
    timeLabel: '90 sec',
    shortDescription: 'A fast blend of berry and milk.',
    steps: ['Add milk + ice to blender.', 'Add strawberry swirl.', 'Blend until silky.'],
    tip: 'Layer extra swirl on the glass walls.',
    productRefs: [
      { type: 'name', value: 'strawberry' },
      { type: 'name', value: 'milk' },
    ],
  },
  {
    id: 'spiced-latte',
    title: 'Spiced Latte',
    timeLabel: '2 min',
    shortDescription: 'Warm spice notes with a soft foam.',
    steps: ['Warm milk and spice blend.', 'Whisk for light foam.', 'Pour and dust cinnamon.'],
    tip: 'Use a tall mug to keep heat in.',
    productRefs: [
      { type: 'name', value: 'latte' },
      { type: 'name', value: 'spice' },
    ],
  },
];
