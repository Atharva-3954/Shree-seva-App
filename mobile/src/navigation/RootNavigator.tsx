import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation.types';
import {useAuthStore} from '../store/authStore';
// Import navigators (commented out until screens are created)
// import { AuthNavigator } from './AuthNavigator';
// import { CustomerNavigator } from './CustomerNavigator';
// import { OwnerNavigator } from './OwnerNavigator';
import {ActivityIndicator, View, StyleSheet, Text} from 'react-native';
import {colors} from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const {isAuthenticated, user, isLoading} = useAuthStore();

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {/* Placeholder - screens will be added later */}
        {/*
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : user?.role === 'owner' ? (
          <Stack.Screen name="Owner" component={OwnerNavigator} />
        ) : (
          <Stack.Screen name="Customer" component={CustomerNavigator} />
        )}
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
