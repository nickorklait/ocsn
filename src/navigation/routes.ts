export const tabRoutes = {
  Home: 'Home',
  Products: 'Products',
  Recipes: 'Recipes',
  Contact: 'Contact',
} as const;

export const drawerRoutes = {
  Tabs: 'Tabs',
  SeasonalCampaigns: 'Seasonal Campaigns',
  UgcGallery: 'Share a Smile, Join the Herd',
  BarcodeScan: 'Scan a barcode',
  FindStratoskua: 'Find Stratoskua',
  SlidingPuzzle: 'Sliding Puzzle',
  FourInARow: 'Four in a Row',
  SpinWheel: 'Spin the Wheel',
  TicTacToe: 'Tre på rad',
  About: 'About',
} as const;

export const routes = {
  ...tabRoutes,
  ...drawerRoutes,
} as const;

export type TabRouteName = (typeof tabRoutes)[keyof typeof tabRoutes];

export type RootTabParamList = {
  [routes.Home]: undefined;
  [routes.Products]: undefined;
  [routes.Recipes]: undefined;
  [routes.Contact]: undefined;
};

export type RootDrawerParamList = {
  [routes.Tabs]: undefined;
  [routes.SeasonalCampaigns]: undefined;
  [routes.UgcGallery]: undefined;
  [routes.BarcodeScan]: undefined;
  [routes.FindStratoskua]: undefined;
  [routes.SlidingPuzzle]: undefined;
  [routes.FourInARow]: undefined;
  [routes.SpinWheel]: undefined;
  [routes.TicTacToe]: undefined;
  [routes.About]: undefined;
};

export type ProductDetailsParams = {
  product: import('../data/products/types').Product;
};

export type ProductsStackParamList = {
  Products: undefined;
  ProductDetails: ProductDetailsParams;
};

export type RecipesStackParamList = {
  Recipes: undefined;
  RecipeDetails: { recipeId: string };
  ProductDetails: ProductDetailsParams;
};

export type UgcStackParamList = {
  UgcGallery: undefined;
  UgcPost: { postId: string };
};
