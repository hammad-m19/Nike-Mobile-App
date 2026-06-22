import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function FavoritesScreen() {
  const { favorites, products, navigate } = useApp();

  // Filter items in products that are in the favorites array
  const favoriteItems = products.filter((p) => favorites.includes(p.id));

  return (
    <View style={styles.container}>
      {favoriteItems.length > 0 ? (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.countText}>
            {favoriteItems.length} {favoriteItems.length === 1 ? 'item' : 'items'} saved
          </Text>
          <View style={styles.gridContainer}>
            {favoriteItems.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </View>
        </ScrollView>
      ) : (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="heart-outline" size={40} color="#FF5A00" />
          </View>
          <Text style={styles.emptyTitle}>Save your favorites</Text>
          <Text style={styles.emptySubtitle}>
            Items you favorite will appear here so you can easily review, select, and buy them.
          </Text>
          <Pressable
            style={styles.exploreButton}
            onPress={() => navigate('Main', 'Home')}
          >
            <Text style={styles.exploreButtonText}>Explore Products</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 100, // accommodate bottom tab bar
  },
  countText: {
    fontSize: 14,
    color: '#8D8D8D',
    fontWeight: '600',
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF2EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8D8D8D',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  exploreButton: {
    backgroundColor: '#111111',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
