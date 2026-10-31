import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  CustomerStackParamList,
  CustomerTabParamList,
} from '../types/navigation.types';
import {colors} from '../theme/colors';

// Screen imports will be added when screens are created
// Tab Screens
// import { HomeScreen } from '../screens/customer/HomeScreen';
// import { CategoriesScreen } from '../screens/customer/CategoriesScreen';
// import { CartScreen } from '../screens/customer/CartScreen';
// import { OrdersScreen } from '../screens/customer/OrdersScreen';
// import { ProfileScreen } from '../screens/customer/ProfileScreen';

// Detail Screens
// import { ProductDetailScreen } from '../screens/customer/ProductDetailScreen';
// import { CategoryProductsScreen } from '../screens/customer/CategoryProductsScreen';
// import { CheckoutScreen } from '../screens/customer/CheckoutScreen';
// import { OrderDetailScreen } from '../screens/customer/OrderDetailScreen';
// import { EditProfileScreen } from '../screens/customer/EditProfileScreen';
// import { AddressesScreen } from '../screens/customer/AddressesScreen';
// import { AddAddressScreen } from '../screens/customer/AddAddressScreen';
// import { EditAddressScreen } from '../screens/customer/EditAddressScreen';
// import { NotificationsScreen } from '../screens/customer/NotificationsScreen';
// import { WriteReviewScreen } from '../screens/customer/WriteReviewScreen';
// import { SearchScreen } from '../screens/customer/SearchScreen';
// import { CouponsScreen } from '../screens/customer/CouponsScreen';

const Tab = createBottomTabNavigator<CustomerTabParamList>();
const Stack = createNativeStackNavigator<CustomerStackParamList>();

const CustomerTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.grey,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 4,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      {/* Tab screens will be registered when created */}
      {/*
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesScreen}
        options={{ tabBarLabel: 'Categories' }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{ tabBarLabel: 'Cart' }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersScreen}
        options={{ tabBarLabel: 'Orders' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
      */}
    </Tab.Navigator>
  );
};

export const CustomerNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      {/* Stack screens will be registered when created */}
      {/*
      <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Addresses" component={AddressesScreen} />
      <Stack.Screen name="AddAddress" component={AddAddressScreen} />
      <Stack.Screen name="EditAddress" component={EditAddressScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="WriteReview" component={WriteReviewScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Coupons" component={CouponsScreen} />
      */}
    </Stack.Navigator>
  );
};
