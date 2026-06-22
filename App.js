import React from 'react';
import { StyleSheet, View, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';

// Import Screens
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import CollectionScreen from './src/screens/CollectionScreen';

// Import Reusable Components
import Header from './src/components/Header';
import BottomTabBar from './src/components/BottomTabBar';

function AppContent() {
  const { currentScreen, activeTab } = useApp();

  // 1. Authentication Screens
  if (currentScreen === 'Login') {
    return <LoginScreen />;
  }

  if (currentScreen === 'SignUp') {
    return <SignUpScreen />;
  }

  // 2. Product Details Screen (full height overlay)
  if (currentScreen === 'ProductDetails') {
    return <ProductDetailsScreen />;
  }

  // 3. Collection Screen (full height overlay)
  if (currentScreen === 'Collection') {
    return <CollectionScreen />;
  }

  // 3. Main Application with Tab Bar
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen />;
      case 'Search':
        return <SearchScreen />;
      case 'Favorites':
        return <FavoritesScreen />;
      case 'Profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'Home':
        return 'DISCOVER';
      case 'Search':
        return 'SEARCH';
      case 'Favorites':
        return 'FAVORITES';
      case 'Profile':
        return 'MEMBER PROFILE';
      default:
        return 'NIKE';
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar style="dark" />
      <Header title={getHeaderTitle()} />
      <View style={styles.tabContentContainer}>
        {renderTabContent()}
      </View>
      <BottomTabBar />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? 30 : 0, // spacing for android status bar if not handled
  },
  tabContentContainer: {
    flex: 1,
  },
});
