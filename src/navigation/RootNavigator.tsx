import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerActions } from '@react-navigation/native';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import {
  routes,
  RootTabParamList,
  RootDrawerParamList,
  TabRouteName,
  ProductsStackParamList,
  RecipesStackParamList,
  UgcStackParamList,
} from './routes';
import { HomeScreen } from '../screens/HomeScreen';
import { ProductsScreen } from '../screens/ProductsScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { ContactScreen } from '../screens/ContactScreen';
import { SeasonalCampaignsScreen } from '../screens/SeasonalCampaignsScreen';
import { RecipesScreen } from '../screens/RecipesScreen';
import { RecipeDetailsScreen } from '../screens/RecipeDetailsScreen';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import { UgcGalleryScreen } from '../screens/UgcGalleryScreen';
import { UgcPostScreen } from '../screens/UgcPostScreen';
import { BarcodeScanScreen } from '../screens/BarcodeScanScreen';
import { FindStratoskua } from '../pages/FindStratoskua';
import { BuildChocolateScreen } from '../games/buildChocolate/BuildChocolateScreen';
import { TriviaScreen } from '../games/trivia/TriviaScreen';
import { SlidingPuzzleScreen } from '../games/slidingPuzzle/SlidingPuzzleScreen';
import { FourInARowScreen } from '../games/fourInARow/FourInARowScreen';
import { SpinWheelScreen } from '../games/spinWheel/SpinWheelScreen';
import { TicTacToeScreen } from '../games/ticTacToe/TicTacToeScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Drawer = createDrawerNavigator<RootDrawerParamList>();
const ProductsStack = createNativeStackNavigator<ProductsStackParamList>();
const RecipesStack = createNativeStackNavigator<RecipesStackParamList>();
const UgcStack = createNativeStackNavigator<UgcStackParamList>();

const tabIconLabel: Record<TabRouteName, string> = {
  [routes.Home]: 'H',
  [routes.Products]: 'P',
  [routes.Recipes]: 'R',
  [routes.Contact]: 'C',
};

const TabIcon = ({ focused, label }: { focused: boolean; label: string }) => {
  return (
    <View style={[styles.iconWrap, focused ? styles.iconWrapActive : null]}>
      <Text style={[styles.iconText, focused ? styles.iconTextActive : null]}>{label}</Text>
    </View>
  );
};

const ProductsStackNavigator = () => (
  <ProductsStack.Navigator screenOptions={{ headerShown: false }}>
    <ProductsStack.Screen name="Products" component={ProductsScreen} />
    <ProductsStack.Screen name="ProductDetails" component={ProductDetailsScreen} />
  </ProductsStack.Navigator>
);

const RecipesStackNavigator = () => (
  <RecipesStack.Navigator screenOptions={{ headerShown: false }}>
    <RecipesStack.Screen name="Recipes" component={RecipesScreen} />
    <RecipesStack.Screen name="RecipeDetails" component={RecipeDetailsScreen} />
    <RecipesStack.Screen name="ProductDetails" component={ProductDetailsScreen} />
  </RecipesStack.Navigator>
);

const UgcStackNavigator = () => (
  <UgcStack.Navigator screenOptions={{ headerShown: false }}>
    <UgcStack.Screen name="UgcGallery" component={UgcGalleryScreen} />
    <UgcStack.Screen name="UgcPost" component={UgcPostScreen} />
  </UgcStack.Navigator>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: colors.brandText,
        sceneStyle: styles.scene,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'rgba(233, 238, 255, 0.7)',
        tabBarHideOnKeyboard: true,
        headerRight: ({ tintColor }) => (
          <Pressable
            style={styles.headerRight}
            onPress={() => navigation.getParent()?.dispatch(DrawerActions.openDrawer())}
          >
            <Text style={[styles.headerRightText, { color: tintColor || colors.brandText }]}>
              More
            </Text>
          </Pressable>
        ),
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} label={tabIconLabel[route.name as TabRouteName]} />
        ),
      })}
    >
      <Tab.Screen name={routes.Home} component={HomeScreen} />
      <Tab.Screen name={routes.Products} component={ProductsStackNavigator} />
      <Tab.Screen name={routes.Recipes} component={RecipesStackNavigator} />
      <Tab.Screen name={routes.Contact} component={ContactScreen} />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: styles.drawer,
        drawerActiveTintColor: '#ffffff',
        drawerInactiveTintColor: 'rgba(233, 238, 255, 0.8)',
        drawerActiveBackgroundColor: 'rgba(255, 255, 255, 0.12)',
      }}
    >
      <Drawer.Screen
        name={routes.Tabs}
        component={TabNavigator}
        options={{ title: 'Main' }}
      />
      <Drawer.Screen name={routes.SeasonalCampaigns} component={SeasonalCampaignsScreen} />
      <Drawer.Screen
        name={routes.UgcGallery}
        component={UgcStackNavigator}
        options={{ title: 'Share a Smile, Join the Herd' }}
      />
      <Drawer.Screen
        name={routes.BarcodeScan}
        component={BarcodeScanScreen}
        options={{ title: 'Scan a barcode' }}
      />
      <Drawer.Screen
        name={routes.FindStratoskua}
        component={FindStratoskua}
        options={{ title: 'Find Stratoskua' }}
      />
      <Drawer.Screen
        name={routes.BuildChocolate}
        component={BuildChocolateScreen}
        options={{ title: 'Build Your Chocolate' }}
      />
      <Drawer.Screen
        name={routes.StratosTrivia}
        component={TriviaScreen}
        options={{ title: 'Stratos Trivia' }}
      />
      <Drawer.Screen name={routes.SlidingPuzzle} component={SlidingPuzzleScreen} />
      <Drawer.Screen name={routes.FourInARow} component={FourInARowScreen} />
      <Drawer.Screen name={routes.SpinWheel} component={SpinWheelScreen} />
      <Drawer.Screen name={routes.TicTacToe} component={TicTacToeScreen} />
      <Drawer.Screen name={routes.About} component={AboutScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  scene: {
    backgroundColor: colors.brandBackground,
  },
  header: {
    backgroundColor: colors.brandBackground,
    borderBottomColor: 'rgba(233, 238, 255, 0.18)',
    borderBottomWidth: 1,
  },
  headerTitle: {
    color: colors.brandText,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(233, 238, 255, 0.18)',
    backgroundColor: 'rgba(11, 30, 97, 0.96)',
    height: 72,
    paddingTop: 6,
    paddingBottom: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  iconWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(233, 238, 255, 0.15)',
  },
  iconWrapActive: {
    backgroundColor: '#ffffff',
  },
  iconText: {
    color: colors.brandText,
    fontSize: 11,
    fontWeight: '700',
  },
  iconTextActive: {
    color: colors.brandBackground,
  },
  drawer: {
    backgroundColor: colors.brandBackground,
  },
  headerRight: {
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(233, 238, 255, 0.12)',
  },
  headerRightText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
