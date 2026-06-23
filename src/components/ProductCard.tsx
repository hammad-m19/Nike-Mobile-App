import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { favorites, toggleFavorite, navigate } = useApp();
  const isFavorite = favorites.includes(product.id);

  const handlePress = () => {
    navigate('ProductDetails', null, product.id);
  };

  return (
    <Pressable style={styles.cardContainer} onPress={handlePress}>
      {/* Image container with light gray background */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Favorite Heart Overlay */}
        <Pressable
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(product.id)}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? '#E01E35' : '#111111'}
          />
        </Pressable>
      </View>

      {/* Product Metadata */}
      <View style={styles.infoContainer}>
        <Text style={styles.subCategory}>{product.subCategory}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%', // standard responsive width controlled by parent
    marginBottom: 20,
  },
  imageContainer: {
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    aspectRatio: 1, // square cards
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  subCategory: {
    fontSize: 11,
    color: '#8D8D8D',
    fontWeight: '500',
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
  },
});
