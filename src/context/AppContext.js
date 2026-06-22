import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';
import { PRODUCTS } from '../data/products';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication State
  const [user, setUser] = useState(null); // { name, email, avatar } when logged in

  // Wishlist State (Array of product IDs)
  const [favorites, setFavorites] = useState([]);

  // Shopping Cart State (Array of { product, size, color, quantity })
  const [cart, setCart] = useState([]);

  // Order History State (Array of { id, date, items, total, status })
  const [orders, setOrders] = useState([]);

  // Custom Navigation State
  const [currentScreen, setCurrentScreen] = useState('Login'); // 'Login', 'SignUp', 'Main', 'ProductDetails', 'Collection'
  const [activeTab, setActiveTab] = useState('Home'); // 'Home', 'Search', 'Favorites', 'Profile'
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null); // 'jordan', 'running', etc.
  const [selectedCollectionTitle, setSelectedCollectionTitle] = useState('');
  const [navigationStack, setNavigationStack] = useState([]);

  // Dynamic products list
  const [products] = useState(PRODUCTS);

  // Navigation Logic
  const navigate = (screen, tab = null, productId = null, collectionData = null) => {
    // Record current state in stack for back navigation
    setNavigationStack((prevStack) => [
      ...prevStack,
      {
        screen: currentScreen,
        tab: activeTab,
        productId: selectedProductId,
        collectionId: selectedCollectionId,
        collectionTitle: selectedCollectionTitle
      }
    ]);

    setCurrentScreen(screen);
    if (tab) setActiveTab(tab);
    if (productId !== undefined) setSelectedProductId(productId);
    
    if (collectionData) {
      setSelectedCollectionId(collectionData.id);
      setSelectedCollectionTitle(collectionData.title);
    }
  };

  const goBack = () => {
    if (navigationStack.length === 0) {
      // Default fallback
      setCurrentScreen('Main');
      setActiveTab('Home');
      setSelectedProductId(null);
      setSelectedCollectionId(null);
      return;
    }

    setNavigationStack((prevStack) => {
      const newStack = [...prevStack];
      const previousState = newStack.pop();
      
      setCurrentScreen(previousState.screen);
      setActiveTab(previousState.tab);
      setSelectedProductId(previousState.productId);
      setSelectedCollectionId(previousState.collectionId);
      setSelectedCollectionTitle(previousState.collectionTitle);
      
      return newStack;
    });
  };

  // Auth Functions
  const login = (email, password) => {
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

    const userName = email.split('@')[0];
    const capitalizedName = userName.charAt(0).toUpperCase() + userName.slice(1);
    
    setUser({
      name: capitalizedName,
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
    });
    
    setNavigationStack([]);
    setCart([]);
    setFavorites([]);
    setOrders([]);
    setCurrentScreen('Main');
    setActiveTab('Home');
    setSelectedProductId(null);
    setSelectedCollectionId(null);
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

    setUser({
      name: name,
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
    });

    setNavigationStack([]);
    setCart([]);
    setFavorites([]);
    setOrders([]);
    setCurrentScreen('Main');
    setActiveTab('Home');
    setSelectedProductId(null);
    setSelectedCollectionId(null);
    return true;
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
    setCart([]);
    setOrders([]);
    setNavigationStack([]);
    setCurrentScreen('Login');
    setActiveTab('Home');
    setSelectedProductId(null);
    setSelectedCollectionId(null);
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

  // Shopping Cart Logic
  const addToCart = (product, size, color) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.size === size &&
          item.color.name === color.name
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      } else {
        return [...prevCart, { product, size, color, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Order Placement Logic
  const placeOrder = (items, total) => {
    const newOrder = {
      id: `NK${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      items: [...items],
      total: total,
      status: 'Preparing for dispatch'
    };
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        favorites,
        cart,
        orders,
        currentScreen,
        activeTab,
        selectedProductId,
        selectedCollectionId,
        selectedCollectionTitle,
        products,
        navigate,
        goBack,
        login,
        register,
        logout,
        updateProfile,
        toggleFavorite,
        addToCart,
        removeFromCart,
        clearCart,
        placeOrder
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
