import {NavigatorScreenParams} from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Customer Tab Navigator
export type CustomerTabParamList = {
  HomeTab: undefined;
  CategoriesTab: undefined;
  CartTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
};

// Customer Stack (contains tab navigator and detail screens)
export type CustomerStackParamList = {
  CustomerTabs: NavigatorScreenParams<CustomerTabParamList>;
  ProductDetail: {productId: number; slug?: string};
  CategoryProducts: {categoryId: number; categoryName: string};
  Checkout: undefined;
  OrderDetail: {orderId: number};
  EditProfile: undefined;
  Addresses: undefined;
  AddAddress: undefined;
  EditAddress: {addressId: number};
  Notifications: undefined;
  WriteReview: {productId: number; orderId: number};
  Search: undefined;
  Coupons: undefined;
};

// Owner Stack
export type OwnerStackParamList = {
  OwnerDashboard: undefined;
  ManageProducts: undefined;
  AddProduct: undefined;
  EditProduct: {productId: number};
  VerifyProducts: undefined;
  ManageCategories: undefined;
  AddCategory: undefined;
  EditCategory: {categoryId: number};
  ManageOrders: undefined;
  OrderManageDetail: {orderId: number};
  ManageInventory: undefined;
  ManageCoupons: undefined;
  AddCoupon: undefined;
  EditCoupon: {couponId: number};
  CustomerList: undefined;
  Reviews: undefined;
  OwnerNotifications: undefined;
  ShopSettings: undefined;
};

// Root Stack
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Customer: NavigatorScreenParams<CustomerStackParamList>;
  Owner: NavigatorScreenParams<OwnerStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
