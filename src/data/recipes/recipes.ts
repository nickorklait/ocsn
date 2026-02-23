import { Recipe } from './types';

export const recipes: Recipe[] = [
  {
    id: 'stratoskake',
    title: 'Stratoskake',
    timeLabel: '3 min',
    shortDescription: 'Myk kake med Stratos og luftig krem.',
    steps: [
      'Pisk egg og sukker lyst.',
      'Vend inn tørrvarer og melk.',
      'Stek i rund form, avkjøl helt.',
      'Del kaken og fyll med Stratoskrem.',
    ],
    tip: 'Kjøl kaken før servering for fastere krem.',
    productRefs: [
      { type: 'name', value: 'stratos' },
      { type: 'name', value: 'sjokolade' },
    ],
  },
  {
    id: 'stratoskrem',
    title: 'Stratoskrem',
    timeLabel: '2 min',
    shortDescription: 'Fløyelsmyk krem med knust Stratos.',
    steps: [
      'Pisk kremfløte lett.',
      'Vend inn knust Stratos og sukker.',
      'Smak til og sett kaldt.',
    ],
    tip: 'Bruk kald bolle for raskere pisking.',
    productRefs: [
      { type: 'name', value: 'stratos' },
      { type: 'name', value: 'sjokolade' },
    ],
  },
  {
    id: 'sjokoladetrekk',
    title: 'Sjokoladetrekk',
    timeLabel: '2 min',
    shortDescription: 'Glansfull topping til Stratoskake.',
    steps: [
      'Smelt sjokolade med litt smør.',
      'Rør glatt og la svalne.',
      'Hell over kaken og fordel jevnt.',
    ],
    tip: 'La trekket sette seg før du skjærer.',
    productRefs: [
      { type: 'name', value: 'stratos' },
      { type: 'name', value: 'sjokolade' },
    ],
  },
];
