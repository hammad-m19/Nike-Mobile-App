import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  SafeAreaView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function CollectionScreen() {
  const {
    selectedCollectionId,
    selectedCollectionTitle,
    products,
    goBack
  } = useApp();

  // Filter products based on selected collection ID
  const getCollectionProducts = () => {
    if (selectedCollectionId === 'jordan') {
      return products.filter(
        (p) =>
          p.name.toLowerCase().includes('jordan') ||
          p.name.toLowerCase().includes('force') ||
          p.subCategory.toLowerCase().includes('basketball')
      );
    } else if (selectedCollectionId === 'running') {
      return products.filter(
        (p) =>
          p.name.toLowerCase().includes('pegasus') ||
          p.subCategory.toLowerCase().includes('run') ||
          p.category.toLowerCase() === 'apparel' && p.description.toLowerCase().includes('run')
      );
    }
    return products;
  };

  const collectionProducts = getCollectionProducts();

  const getCollectionBanner = () => {
    if (selectedCollectionId === 'jordan') {
      return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1200&auto=format&fit=crop';
  };

  const getCollectionDescription = () => {
    if (selectedCollectionId === 'jordan') {
      return 'Iconic basketball footwear engineered for flight and performance. Heritage styles remastered for today\'s sneaker culture.';
    }
    return 'Premium high-performance apparel and running shoes designed to keep you cool, dry, and moving forward on every mile.';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={goBack} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </Pressable>
        <Text style={styles.headerTitle}>{selectedCollectionTitle.toUpperCase()}</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner Hero */}
        <View style={styles.bannerContainer}>
          <Image source={{ uri: getCollectionBanner() }} style={styles.bannerImage} />
          <View style={styles.bannerOverlay} />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>{selectedCollectionTitle}</Text>
            <Text style={styles.bannerDesc}>{getCollectionDescription()}</Text>
          </View>
        </View>

        {/* Products Grid */}
        <View style={styles.gridSection}>
          <Text style={styles.resultsCount}>Showing {collectionProducts.length} items</Text>
          <View style={styles.gridContainer}>
            {collectionProducts.map((item) => (
              <View key={item.id} style={styles.gridCardWrapper}>
                <ProductCard product={item} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 0.5,
  },
  headerButton: {
    padding: 8,
  },
  headerPlaceholder: {
    width: 40, // match back button size for centering title
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  bannerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bannerContent: {
    padding: 20,
    zIndex: 1,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  bannerDesc: {
    fontSize: 12,
    color: '#E5E5E5',
    lineHeight: 18,
    fontWeight: '500',
  },
  gridSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  resultsCount: {
    fontSize: 13,
    color: '#8D8D8D',
    fontWeight: '600',
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCardWrapper: {
    width: '47%',
  },
});
