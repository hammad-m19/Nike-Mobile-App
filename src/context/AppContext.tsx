import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Alert } from 'react-native';
import { PRODUCTS, Product, ProductColor } from '../data/products';

export interface User {
  name: string;
  email: string;
  avatar: string | null;
  address: string;
  password?: string;
}

export interface CartItem {
  product: Product;
  size: string;
  color: ProductColor;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: string;
}

export interface NavigationState {
  screen: string;
  tab: string;
  productId: string | null;
  collectionId: string | null;
  collectionTitle: string;
}

export interface AppContextType {
  user: User | null;
  favorites: string[];
  cart: CartItem[];
  orders: Order[];
  currentScreen: string;
  activeTab: string;
  selectedProductId: string | null;
  selectedCollectionId: string | null;
  selectedCollectionTitle: string;
  products: Product[];
  navigate: (
    screen: string,
    tab?: string | null,
    productId?: string | null,
    collectionData?: { id: string; title: string } | null
  ) => void;
  goBack: () => void;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, confirmPassword: string) => boolean;
  logout: () => void;
  updateProfile: (
    name: string,
    email: string,
    address: string,
    avatar?: string | null,
    newPassword?: string | null
  ) => boolean;
  updateAddress: (address: string) => boolean;
  toggleFavorite: (productId: string) => void;
  addToCart: (product: Product, size: string, color: ProductColor) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  placeOrder: (items: CartItem[], total: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Authentication State
  const [user, setUser] = useState<User | null>(null); // { name, email, avatar, address, password } when logged in

  // Wishlist State (Array of product IDs)
  const [favorites, setFavorites] = useState<string[]>([]);

  // Shopping Cart State (Array of { product, size, color, quantity })
  const [cart, setCart] = useState<CartItem[]>([]);

  // Order History State (Array of { id, date, items, total, status })
  const [orders, setOrders] = useState<Order[]>([]);

  // Custom Navigation State
  const [currentScreen, setCurrentScreen] = useState<string>('Login'); // 'Login', 'SignUp', 'Main', 'ProductDetails', 'Collection'
  const [activeTab, setActiveTab] = useState<string>('Home'); // 'Home', 'Search', 'Favorites', 'Profile'
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null); // 'jordan', 'running', etc.
  const [selectedCollectionTitle, setSelectedCollectionTitle] = useState<string>('');
  const [navigationStack, setNavigationStack] = useState<NavigationState[]>([]);

  // Dynamic products list
  const [products] = useState<Product[]>(PRODUCTS);

  // Navigation Logic
  const navigate = (
    screen: string,
    tab: string | null = null,
    productId: string | null = null,
    collectionData: { id: string; title: string } | null = null
  ) => {
    // Record current state in stack for back navigation
    setNavigationStack((prevStack) => [
      ...prevStack,
      {
        screen: currentScreen,
        tab: activeTab,
        productId: selectedProductId,
        collectionId: selectedCollectionId,
        collectionTitle: selectedCollectionTitle,
      },
    ]);

    setCurrentScreen(screen);
    if (tab) setActiveTab(tab);
    if (productId !== null) setSelectedProductId(productId);

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

      if (previousState) {
        setCurrentScreen(previousState.screen);
        setActiveTab(previousState.tab);
        setSelectedProductId(previousState.productId);
        setSelectedCollectionId(previousState.collectionId);
        setSelectedCollectionTitle(previousState.collectionTitle);
      }

      return newStack;
    });
  };

  // Auth Functions
  const login = (email: string, password: string) => {
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
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      address: '123 Nike Way, Beaverton, OR 97005', // Default Nike HQ address
      password: password,
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

  const register = (name: string, email: string, password: string, confirmPassword: string) => {
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
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      address: '123 Nike Way, Beaverton, OR 97005',
      password: password,
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

  const updateProfile = (
    name: string,
    email: string,
    address: string,
    avatar: string | null = undefined as any,
    newPassword: string | null = null
  ) => {
    if (!name || !email) {
      Alert.alert('Error', 'Name and email cannot be empty');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        name,
        email,
        address,
        avatar: avatar !== undefined ? avatar : prev.avatar,
        ...(newPassword ? { password: newPassword } : {}),
      };
    });
    return true;
  };

  const updateAddress = (address: string) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        address,
      };
    });
    return true;
  };

  // Favorites (Wishlist) Logic
  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Shopping Cart Logic
  const addToCart = (product: Product, size: string, color: ProductColor) => {
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

  const removeFromCart = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Order Placement Logic
  const placeOrder = (items: CartItem[], total: number) => {
    const newOrder = {
      id: `NK${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      items: [...items],
      total: total,
      status: 'Preparing for dispatch',
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
        updateAddress,
        toggleFavorite,
        addToCart,
        removeFromCart,
        clearCart,
        placeOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
