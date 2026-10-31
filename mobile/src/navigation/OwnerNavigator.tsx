import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {OwnerStackParamList} from '../types/navigation.types';

// Screen imports will be added when screens are created
// import { OwnerDashboardScreen } from '../screens/owner/OwnerDashboardScreen';
// import { ManageProductsScreen } from '../screens/owner/ManageProductsScreen';
// import { AddProductScreen } from '../screens/owner/AddProductScreen';
// import { EditProductScreen } from '../screens/owner/EditProductScreen';
// import { VerifyProductsScreen } from '../screens/owner/VerifyProductsScreen';
// import { ManageCategoriesScreen } from '../screens/owner/ManageCategoriesScreen';
// import { AddCategoryScreen } from '../screens/owner/AddCategoryScreen';
// import { EditCategoryScreen } from '../screens/owner/EditCategoryScreen';
// import { ManageOrdersScreen } from '../screens/owner/ManageOrdersScreen';
// import { OrderManageDetailScreen } from '../screens/owner/OrderManageDetailScreen';
// import { ManageInventoryScreen } from '../screens/owner/ManageInventoryScreen';
// import { ManageCouponsScreen } from '../screens/owner/ManageCouponsScreen';
// import { AddCouponScreen } from '../screens/owner/AddCouponScreen';
// import { EditCouponScreen } from '../screens/owner/EditCouponScreen';
// import { CustomerListScreen } from '../screens/owner/CustomerListScreen';
// import { ReviewsScreen } from '../screens/owner/ReviewsScreen';
// import { OwnerNotificationsScreen } from '../screens/owner/OwnerNotificationsScreen';
// import { ShopSettingsScreen } from '../screens/owner/ShopSettingsScreen';

const Stack = createNativeStackNavigator<OwnerStackParamList>();

export const OwnerNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      {/* Screens will be registered when created */}
      {/*
      <Stack.Screen name="OwnerDashboard" component={OwnerDashboardScreen} />
      <Stack.Screen name="ManageProducts" component={ManageProductsScreen} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} />
      <Stack.Screen name="EditProduct" component={EditProductScreen} />
      <Stack.Screen name="VerifyProducts" component={VerifyProductsScreen} />
      <Stack.Screen name="ManageCategories" component={ManageCategoriesScreen} />
      <Stack.Screen name="AddCategory" component={AddCategoryScreen} />
      <Stack.Screen name="EditCategory" component={EditCategoryScreen} />
      <Stack.Screen name="ManageOrders" component={ManageOrdersScreen} />
      <Stack.Screen name="OrderManageDetail" component={OrderManageDetailScreen} />
      <Stack.Screen name="ManageInventory" component={ManageInventoryScreen} />
      <Stack.Screen name="ManageCoupons" component={ManageCouponsScreen} />
      <Stack.Screen name="AddCoupon" component={AddCouponScreen} />
      <Stack.Screen name="EditCoupon" component={EditCouponScreen} />
      <Stack.Screen name="CustomerList" component={CustomerListScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
      <Stack.Screen name="OwnerNotifications" component={OwnerNotificationsScreen} />
      <Stack.Screen name="ShopSettings" component={ShopSettingsScreen} />
      */}
    </Stack.Navigator>
  );
};
