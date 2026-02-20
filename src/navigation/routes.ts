export const tabRoutes = {
  Home: 'Home',
  Products: 'Products',
  Recipes: 'Recipes',
  About: 'About',
  Contact: 'Contact',
} as const;

export const drawerRoutes = {
  Tabs: 'Tabs',
  SeasonalCampaigns: 'Seasonal Campaigns',
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
  [routes.About]: undefined;
  [routes.Contact]: undefined;
};

export type RootDrawerParamList = {
  [routes.Tabs]: undefined;
  [routes.SeasonalCampaigns]: undefined;
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
