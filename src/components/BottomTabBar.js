import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function BottomTabBar() {
  const { activeTab, navigate } = useApp();

  const tabs = [
    { name: 'Home', activeIcon: 'home', inactiveIcon: 'home-outline', label: 'Shop' },
    { name: 'Search', activeIcon: 'search', inactiveIcon: 'search-outline', label: 'Search' },
    { name: 'Favorites', activeIcon: 'heart', inactiveIcon: 'heart-outline', label: 'Favorites' },
    { name: 'Profile', activeIcon: 'person', inactiveIcon: 'person-outline', label: 'Profile' }
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        const iconName = isActive ? tab.activeIcon : tab.inactiveIcon;

        return (
          <Pressable
            key={tab.name}
            onPress={() => navigate('Main', tab.name)}
            style={styles.tabButton}
          >
            <Ionicons
              name={iconName}
              size={22}
              color={isActive ? '#111111' : '#8D8D8D'}
              style={styles.icon}
            />
            <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeIndicator} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 88 : 68,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
  },
  activeLabel: {
    color: '#111111',
    fontWeight: '700',
  },
  inactiveLabel: {
    color: '#8D8D8D',
  },
  activeIndicator: {
    position: 'absolute',
    top: -10,
    width: 24,
    height: 3,
    backgroundColor: '#111111',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
});
