import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';
import { PRODUCTS } from '../data/products';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication State
  const [user, setUser] = useState(null); // { name, email, avatar } when logged in

  // Wishlist State (Array of product IDs)
  const [favorites, setFavorites] = useState([]);

  // Custom Navigation State
  const [currentScreen, setCurrentScreen] = useState('Login'); // 'Login', 'SignUp', 'Main', 'ProductDetails'
  const [activeTab, setActiveTab] = useState('Home'); // 'Home', 'Search', 'Favorites', 'Profile'
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [navigationStack, setNavigationStack] = useState([]);

  // Dynamic products list (in case we need to update/manage)
  const [products] = useState(PRODUCTS);

  // Navigation Logic
  const navigate = (screen, tab = null, productId = null) => {
    // Record current state in stack for back navigation
    setNavigationStack((prevStack) => [
      ...prevStack,
      { screen: currentScreen, tab: activeTab, productId: selectedProductId }
    ]);

    setCurrentScreen(screen);
    if (tab) setActiveTab(tab);
    if (productId !== undefined) setSelectedProductId(productId);
  };

  const goBack = () => {
    if (navigationStack.length === 0) {
      // Default fallback
      setCurrentScreen('Main');
      setActiveTab('Home');
      setSelectedProductId(null);
      return;
    }

    setNavigationStack((prevStack) => {
      const newStack = [...prevStack];
      const previousState = newStack.pop();
      
      setCurrentScreen(previousState.screen);
      setActiveTab(previousState.tab);
      setSelectedProductId(previousState.productId);
      
      return newStack;
    });
  };

  // Auth Functions
  const login = (email, password) => {
    // Simple verification
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    // Success - Set default Nike Member profile
    const userName = email.split('@')[0];
    const capitalizedName = userName.charAt(0).toUpperCase() + userName.slice(1);
    
    setUser({
      name: capitalizedName,
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop' // default mockup avatar
    });
    
    // Clear navigation history and route to Main Home
    setNavigationStack([]);
    setCurrentScreen('Main');
    setActiveTab('Home');
    setSelectedProductId(null);
    return true;
  };

  const register = (name, email, password, confirmPassword) => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    // Success - Set User
    setUser({
      name: name,
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
    });

    // Clear navigation history and route to Main Home
    setNavigationStack([]);
    setCurrentScreen('Main');
    setActiveTab('Home');
    setSelectedProductId(null);
    return true;
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
    setNavigationStack([]);
    setCurrentScreen('Login');
    setActiveTab('Home');
    setSelectedProductId(null);
  };

  const updateProfile = (name, email) => {
    if (!name || !email) {
      Alert.alert('Error', 'Name and email cannot be empty');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    
    setUser((prev) => ({
      ...prev,
      name,
      email
    }));
    return true;
  };

  // Favorites (Wishlist) Logic
  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        favorites,
        currentScreen,
        activeTab,
        selectedProductId,
        products,
        navigate,
        goBack,
        login,
        register,
        logout,
        updateProfile,
        toggleFavorite
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
