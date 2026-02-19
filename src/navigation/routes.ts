export const tabRoutes = {
  Home: 'Home',
  Products: 'Products',
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
  [routes.About]: undefined;
  [routes.Contact]: undefined;
};

export type RootDrawerParamList = {
  [routes.Tabs]: undefined;
  [routes.SeasonalCampaigns]: undefined;
};
