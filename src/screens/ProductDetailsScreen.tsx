import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  SafeAreaView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Product, ProductColor } from '../data/products';

export default function ProductDetailsScreen() {
  const { selectedProductId, products, favorites, toggleFavorite, goBack, addToCart } = useApp();

  // Find the selected product
  const product = products.find((p) => p.id === selectedProductId);

  // Default selections
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    product && product.colors ? product.colors[0] : null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product && product.sizes ? product.sizes[0] : null
  );
  const [isDescExpanded, setIsDescExpanded] = useState(true);

  if (!product) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found.</Text>
        <Pressable onPress={goBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const isFavorite = favorites.includes(product.id);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      Alert.alert('Selection Required', 'Please select size and color before adding to bag.');
      return;
    }
    
    addToCart(product, selectedSize, selectedColor);
    
    Alert.alert(
      'Added to Bag',
      `Successfully added ${product.name} (Size: ${selectedSize}, Color: ${selectedColor ? selectedColor.name : ''}) to your shopping bag!`,
      [{ text: 'Great' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Floating Header */}
      <View style={styles.header}>
        <Pressable onPress={goBack} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </Pressable>
        <Text style={styles.headerTitle}>Product Details</Text>
        <Pressable
          onPress={() => toggleFavorite(product.id)}
          style={styles.headerButton}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#E01E35' : '#111111'}
          />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Large Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image as any} resizeMode="cover" />
        </View>

        {/* Info Area */}
        <View style={styles.infoContainer}>
          <Text style={styles.subCategory}>{product.subCategory}</Text>
          <View style={styles.titlePriceRow}>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>${product.price}</Text>
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#FFB300" />
            <Text style={styles.ratingText}>
              {product.rating} <Text style={styles.reviewsCount}>({product.reviews} reviews)</Text>
            </Text>
          </View>

          {/* Color Selection Bubble Container */}
          <View style={styles.optionSection}>
            <Text style={styles.sectionTitle}>
              Select Color:{' '}
              <Text style={styles.selectedOptionValue}>
                {selectedColor ? selectedColor.name : ''}
              </Text>
            </Text>
            <View style={styles.colorsContainer}>
              {product.colors.map((color) => {
                const isColorSelected = selectedColor?.name === color.name;
                return (
                  <Pressable
                    key={color.name}
                    style={[
                      styles.colorBorder,
                      isColorSelected ? styles.activeColorBorder : null
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    <View style={[styles.colorBubble, { backgroundColor: color.code }]} />
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Size Selection Grid */}
          <View style={styles.optionSection}>
            <Text style={styles.sectionTitle}>
              Select Size:{' '}
              <Text style={styles.selectedOptionValue}>{selectedSize || ''}</Text>
            </Text>
            <View style={styles.sizesGrid}>
              {product.sizes.map((size) => {
                const isSizeSelected = selectedSize === size;
                return (
                  <Pressable
                    key={size}
                    style={[
                      styles.sizeChip,
                      isSizeSelected ? styles.activeSizeChip : null
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        isSizeSelected ? styles.activeSizeText : null
                      ]}
                    >
                      {size}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Description Dropdown Accordion */}
          <View style={styles.descriptionSection}>
            <Pressable
              style={styles.descHeader}
              onPress={() => setIsDescExpanded(!isDescExpanded)}
            >
              <Text style={styles.sectionTitle}>Product Description</Text>
              <Ionicons
                name={isDescExpanded ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#111111"
              />
            </Pressable>
            {isDescExpanded && (
              <Text style={styles.descriptionText}>{product.description}</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom action bar */}
      <View style={styles.bottomBar}>
        <Pressable
          style={[styles.favoriteBarButton, isFavorite ? styles.favoriteBarButtonActive : null]}
          onPress={() => toggleFavorite(product.id)}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? '#E01E35' : '#111111'}
          />
        </Pressable>
        <Pressable style={styles.cartBarButton} onPress={handleAddToCart}>
          <Text style={styles.cartBarButtonText}>Add to Bag</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
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
    paddingTop: Platform.OS === 'android' ? 24 : 0, // safe top spacing for Android
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },
  headerButton: {
    padding: 8,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.1,
    backgroundColor: '#F6F6F6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  subCategory: {
    fontSize: 13,
    color: '#FF5A00',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111111',
    flex: 1,
    paddingRight: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111111',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingText: {
    fontSize: 13,
    color: '#111111',
    fontWeight: '600',
    marginLeft: 6,
  },
  reviewsCount: {
    color: '#8D8D8D',
    fontWeight: '500',
  },
  optionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 12,
  },
  selectedOptionValue: {
    color: '#8D8D8D',
    fontWeight: '500',
  },
  colorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorBorder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeColorBorder: {
    borderColor: '#111111',
  },
  colorBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  sizesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizeChip: {
    minWidth: 54,
    height: 44,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  activeSizeChip: {
    borderColor: '#111111',
    backgroundColor: '#111111',
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
  },
  activeSizeText: {
    color: '#FFFFFF',
  },
  descriptionSection: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingVertical: 20,
    marginBottom: 30,
  },
  descHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  descriptionText: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 22,
    marginTop: 10,
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 96 : 76,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 24 : 0,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  favoriteBarButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteBarButtonActive: {
    borderColor: '#FFD2D2',
    backgroundColor: '#FFF5F5',
  },
  cartBarButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#111111',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  cartBarButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8D8D8D',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#111111',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
