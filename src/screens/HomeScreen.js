import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  Dimensions
} from 'react-native';
import { useApp } from '../context/AppContext';
import { CATEGORIES, CAMPAIGNS } from '../data/products';
import ProductCard from '../components/ProductCard';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, products, navigate } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter products based on selected category
  const getFilteredProducts = () => {
    if (selectedCategory === 'All') return products;
    return products.filter(
      (product) => product.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  };

  const filteredProducts = getFilteredProducts();
  const trendingProducts = filteredProducts.filter((p) => p.isTrending);
  const featuredProducts = filteredProducts.filter((p) => p.isFeatured);

  // Render a promotional campaign card
  const renderCampaignItem = ({ item }) => (
    <View style={styles.campaignCard}>
      <Image source={{ uri: item.image }} style={styles.campaignImage} />
      <View style={styles.campaignOverlay} />
      <View style={styles.campaignContent}>
        <Text style={styles.campaignSubtitle}>{item.subtitle}</Text>
        <Text style={styles.campaignTitle}>{item.title}</Text>
        <Pressable
          style={styles.campaignButton}
          onPress={() => {
            const isJordan = item.id === 'c1';
            navigate('Collection', null, null, {
              id: isJordan ? 'jordan' : 'running',
              title: isJordan ? 'Air Jordan Retro' : 'Nike Running Gear'
            });
          }}
        >
          <Text style={styles.campaignButtonText}>{item.buttonText}</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      
      {/* Header Greeting */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingSub}>Hello, {user ? user.name : 'Nike Member'}</Text>
        <Text style={styles.greetingMain}>Ready for Sport?</Text>
      </View>

      {/* Campaigns Banner Slider */}
      <FlatList
        data={CAMPAIGNS}
        renderItem={renderCampaignItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.campaignList}
      />

      {/* Category Horizontal Selector */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <Pressable
              key={category}
              style={[styles.categoryChip, isSelected ? styles.activeCategoryChip : null]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  isSelected ? styles.activeCategoryText : null
                ]}
              >
                {category}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Trending Section */}
      {trendingProducts.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingContent}
          >
            {trendingProducts.map((item) => (
              <View key={item.id} style={styles.trendingCardWrapper}>
                <ProductCard product={item} />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Featured Section */}
      {featuredProducts.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Collection</Text>
          </View>
          <View style={styles.featuredGrid}>
            {featuredProducts.map((item) => (
              <View key={item.id} style={styles.gridCardWrapper}>
                <ProductCard product={item} />
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 100, // accommodate bottom tab bar
  },
  greetingContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greetingSub: {
    fontSize: 14,
    color: '#8D8D8D',
    fontWeight: '600',
  },
  greetingMain: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  campaignList: {
    marginVertical: 12,
  },
  campaignCard: {
    width: width - 40,
    height: 180,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  campaignImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  campaignOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  campaignContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  campaignSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  campaignTitle: {
    fontSize: 22,
    fontWeight: '850',
    color: '#FFFFFF',
    marginVertical: 6,
    letterSpacing: -0.5,
  },
  campaignButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  campaignButtonText: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionContainer: {
    marginTop: 10,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '750',
    color: '#111111',
  },
  categoriesContainer: {
    maxHeight: 50,
    marginBottom: 8,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#F6F6F6',
    marginRight: 8,
  },
  activeCategoryChip: {
    backgroundColor: '#111111',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8D8D8D',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  trendingContent: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  trendingCardWrapper: {
    width: width * 0.44,
    marginRight: 16,
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  gridCardWrapper: {
    width: '47%',
  },
});
