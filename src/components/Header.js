import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function Header({ title, showBack = false }) {
  const { goBack } = useApp();

  return (
    <View style={styles.container}>
      {showBack ? (
        <Pressable onPress={goBack} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </Pressable>
      ) : (
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>NIKE</Text>
          <View style={styles.dot} />
        </View>
      )}

      {title && <Text style={styles.titleText}>{title}</Text>}

      <View style={styles.rightActions}>
        <Pressable style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={22} color="#111111" />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <Ionicons name="bag-outline" size={22} color="#111111" style={styles.bagIcon} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -1,
    color: '#111111',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FF5A00',
    marginLeft: 2,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -40 }], // rough centering
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  bagIcon: {
    marginLeft: 10,
  },
});
