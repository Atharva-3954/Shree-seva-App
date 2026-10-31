import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ActivityIndicator, View, StyleSheet, Text} from 'react-native';
import {useAuthStore} from '../store/authStore';
import {colors} from '../theme/colors';

// Initializing banner screen - allows React Navigation to boot cleanly before UI screens are attached
const InitializingScreen: React.FC = () => (
  <View style={styles.container}>
    <View style={styles.badge}>
      <Text style={styles.badgeText}>Ready</Text>
    </View>
    <Text style={styles.title}>Shree Seva</Text>
    <Text style={styles.subtitle}>Single-Shop E-Commerce</Text>
    <Text style={styles.status}>Frontend Architecture & Navigation Prepared</Text>
  </View>
);

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const {isLoading, loadStoredAuth} = useAuthStore();

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

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
        <Stack.Screen name="Initializing" component={InitializingScreen} />
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  badge: {
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 16,
  },
  badgeText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.black,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey,
    marginBottom: 16,
  },
  status: {
    fontSize: 13,
    color: colors.grey,
    textAlign: 'center',
  },
});
