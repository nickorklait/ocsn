import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { routes, RootTabParamList, RootDrawerParamList, TabRouteName } from './routes';
import { HomeScreen } from '../screens/HomeScreen';
import { ProductsScreen } from '../screens/ProductsScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { ContactScreen } from '../screens/ContactScreen';
import { SeasonalCampaignsScreen } from '../screens/SeasonalCampaignsScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Drawer = createDrawerNavigator<RootDrawerParamList>();

const tabIconLabel: Record<TabRouteName, string> = {
  [routes.Home]: 'H',
  [routes.Products]: 'P',
  [routes.About]: 'A',
  [routes.Contact]: 'C',
};

const TabIcon = ({ focused, label }: { focused: boolean; label: string }) => {
  return (
    <View style={[styles.iconWrap, focused ? styles.iconWrapActive : null]}>
      <Text style={[styles.iconText, focused ? styles.iconTextActive : null]}>{label}</Text>
    </View>
  );
};

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
            onPress={() => navigation.getParent()?.openDrawer()}
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
      <Tab.Screen name={routes.Products} component={ProductsScreen} />
      <Tab.Screen name={routes.About} component={AboutScreen} />
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
