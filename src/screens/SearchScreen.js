import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function SearchScreen() {
  const { products } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const popularSearches = [
    'Air Max',
    'Jordan',
    'Force',
    'Pegasus',
    'Tech Fleece',
    'Cap',
    'Running'
  ];

  // Perform filtering logic
  const getFilteredProducts = () => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.subCategory.toLowerCase().includes(query)
    );
  };

  const filteredProducts = getFilteredProducts();
  const hasQuery = searchQuery.trim().length > 0;

  const handleTagPress = (tag) => {
    setSearchQuery(tag);
    Keyboard.dismiss();
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons name="search" size={20} color="#8D8D8D" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search products by name or category"
            placeholderTextColor="#8D8D8D"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            returnKeyType="search"
          />
          {hasQuery && (
            <Pressable onPress={handleClear} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color="#8D8D8D" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Content */}
      {hasQuery ? (
        // Results Listing
        filteredProducts.length > 0 ? (
          <ScrollView
            style={styles.resultsContainer}
            contentContainerStyle={styles.resultsScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.resultsCount}>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} for "{searchQuery}"
            </Text>
            <View style={styles.gridContainer}>
              {filteredProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </View>
          </ScrollView>
        ) : (
          // Empty Results State
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={60} color="#E5E5E5" />
            <Text style={styles.emptyTitle}>No Results Found</Text>
            <Text style={styles.emptySubtitle}>
              We couldn't find anything matching "{searchQuery}". Try checking the spelling or using broader keywords.
            </Text>
          </View>
        )
      ) : (
        // Initial Search Suggestions State
        <ScrollView
          style={styles.suggestionsContainer}
          contentContainerStyle={styles.suggestionsScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionTitle}>Popular Searches</Text>
          <View style={styles.tagsContainer}>
            {popularSearches.map((search) => (
              <Pressable
                key={search}
                style={styles.tag}
                onPress={() => handleTagPress(search)}
              >
                <Text style={styles.tagText}>{search}</Text>
                <Ionicons name="chevron-forward" size={12} color="#8D8D8D" />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchBarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111111',
    fontWeight: '500',
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsScrollContent: {
    paddingTop: 16,
    paddingBottom: 100, // accommodate bottom tab bar
  },
  resultsCount: {
    fontSize: 14,
    color: '#8D8D8D',
    fontWeight: '500',
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
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '750',
    color: '#111111',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8D8D8D',
    textAlign: 'center',
    lineHeight: 19,
  },
  suggestionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  suggestionsScrollContent: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '750',
    color: '#111111',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'column',
  },
  tag: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
});
