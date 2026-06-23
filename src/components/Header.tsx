import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Image,
  Alert,
  SafeAreaView,
  Platform,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

export default function Header({ title, showBack = false }: HeaderProps) {
  const { goBack, cart, removeFromCart, clearCart, placeOrder, user, updateAddress } = useApp();
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);

  // Inline address editing states
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState('');

  const handleSaveAddress = () => {
    if (!addressInput.trim()) {
      Alert.alert('Error', 'Address cannot be empty.');
      return;
    }
    updateAddress(addressInput.trim());
    setIsEditingAddress(false);
  };

  // Notifications Mock Data
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'EXCLUSIVE MEMBER REWARD',
      desc: 'Use coupon code MEMBER10 for 10% off your next purchase.',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 'n2',
      title: 'AIR JORDAN RETRO RESTOCK',
      desc: 'The Jordan 1 Retro High is back in stock. Tap to explore.',
      time: '1 day ago',
      unread: true
    },
    {
      id: 'n3',
      title: 'WELCOME TO NIKE CLUB',
      desc: 'Welcome Hammad! Enjoy premium member perks, free standard shipping, and custom collections.',
      time: '3 days ago',
      unread: false
    }
  ]);

  const handleCheckout = () => {
    Alert.alert(
      'Order Placed!',
      'Thank you for shopping with Nike. Your order has been registered and is being prepared for dispatch.',
      [
        {
          text: 'Awesome',
          onPress: () => {
            placeOrder(cart, cartSubtotal);
            clearCart();
            setIsCartVisible(false);
          }
        }
      ]
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Calculations for shopping cart
  const cartTotalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const unreadNotificationsCount = notifications.filter((n) => n.unread).length;

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
        {/* Notifications Icon Button */}
        <Pressable onPress={() => setIsNotificationsVisible(true)} style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={22} color="#111111" />
          {unreadNotificationsCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadNotificationsCount}</Text>
            </View>
          )}
        </Pressable>

        {/* Cart Icon Button */}
        <Pressable onPress={() => setIsCartVisible(true)} style={styles.iconButton}>
          <Ionicons name="bag-outline" size={22} color="#111111" style={styles.bagIcon} />
          {cartTotalQty > 0 && (
            <View style={[styles.badge, styles.bagBadge]}>
              <Text style={styles.badgeText}>{cartTotalQty}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* ==================== SHOPPING BAG MODAL ==================== */}
      <Modal
        animationType="slide"
        visible={isCartVisible}
        onRequestClose={() => setIsCartVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>YOUR BAG</Text>
            <Pressable onPress={() => setIsCartVisible(false)} style={styles.closeModalButton}>
              <Ionicons name="close" size={24} color="#111111" />
            </Pressable>
          </View>

          {cart.length > 0 ? (
            <View style={styles.cartContentContainer}>
              <ScrollView showsVerticalScrollIndicator={false} style={styles.cartItemsScroll}>
                {cart.map((item, index) => (
                  <View key={`${item.product.id}-${index}`} style={styles.cartItemCard}>
                    <Image source={{ uri: item.product.image }} style={styles.cartItemImage} />
                    <View style={styles.cartItemInfo}>
                      <Text style={styles.cartItemName} numberOfLines={1}>{item.product.name}</Text>
                      <Text style={styles.cartItemSub}>{item.product.subCategory}</Text>
                      <Text style={styles.cartItemDetails}>
                        Size: {item.size}  |  Color: {item.color ? item.color.name : ''}
                      </Text>
                      <View style={styles.cartQuantityPriceRow}>
                        <Text style={styles.cartItemQty}>Qty: {item.quantity}</Text>
                        <Text style={styles.cartItemPrice}>${item.product.price * item.quantity}</Text>
                      </View>
                    </View>
                    <Pressable
                      style={styles.cartItemDelete}
                      onPress={() => removeFromCart(index)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#8D8D8D" />
                    </Pressable>
                  </View>
                ))}
              </ScrollView>

              {/* Cart Summary */}
              <View style={styles.cartSummaryContainer}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>${cartSubtotal}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery</Text>
                  <Text style={[styles.summaryValue, styles.freeShipping]}>Free</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>${cartSubtotal}</Text>
                </View>

                {/* Shipping Destination */}
                <View style={styles.shippingSection}>
                  <View style={styles.shippingHeaderRow}>
                    <View style={styles.shippingHeaderLeft}>
                      <Ionicons name="location-outline" size={16} color="#FF5A00" />
                      <Text style={styles.shippingTitle}>DELIVERING TO</Text>
                    </View>
                    {isEditingAddress ? (
                      <View style={styles.addressEditActionRow}>
                        <Pressable onPress={handleSaveAddress} style={styles.addressActionBtn}>
                          <Text style={styles.addressActionSaveText}>Save</Text>
                        </Pressable>
                        <Pressable onPress={() => setIsEditingAddress(false)} style={[styles.addressActionBtn, { marginLeft: 12 }]}>
                          <Text style={styles.addressActionCancelText}>Cancel</Text>
                        </Pressable>
                      </View>
                    ) : (
                      <Pressable onPress={() => {
                        setAddressInput(user && user.address ? user.address : '123 Nike Way, Beaverton, OR 97005');
                        setIsEditingAddress(true);
                      }}>
                        <Text style={styles.changeAddressLinkText}>Edit</Text>
                      </Pressable>
                    )}
                  </View>
                  
                  {isEditingAddress ? (
                    <TextInput
                      style={styles.inlineAddressInput}
                      value={addressInput}
                      onChangeText={setAddressInput}
                      multiline
                      autoFocus
                      placeholder="Street Address, City, State, ZIP"
                    />
                  ) : (
                    <Text style={styles.shippingAddressText}>
                      {user && user.address ? user.address : '123 Nike Way, Beaverton, OR 97005'}
                    </Text>
                  )}
                </View>

                {/* Checkout CTA */}
                <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
                  <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            /* Empty State */
            <View style={styles.emptyModalContainer}>
              <Ionicons name="bag-outline" size={80} color="#E5E5E5" />
              <Text style={styles.emptyModalTitle}>Your bag is empty.</Text>
              <Text style={styles.emptyModalSubtitle}>
                Add items to your bag while you shop. Standard shipping is free for Members.
              </Text>
              <Pressable style={styles.browseButton} onPress={() => setIsCartVisible(false)}>
                <Text style={styles.browseButtonText}>Start Shopping</Text>
              </Pressable>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* ==================== NOTIFICATIONS MODAL ==================== */}
      <Modal
        animationType="slide"
        visible={isNotificationsVisible}
        onRequestClose={() => setIsNotificationsVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>NOTIFICATIONS</Text>
            <Pressable onPress={() => setIsNotificationsVisible(false)} style={styles.closeModalButton}>
              <Ionicons name="close" size={24} color="#111111" />
            </Pressable>
          </View>

          <ScrollView style={styles.notificationsScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.notificationActions}>
              <Pressable onPress={markAllNotificationsAsRead}>
                <Text style={styles.markReadText}>Mark all as read</Text>
              </Pressable>
            </View>

            {notifications.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.notificationItem,
                  item.unread ? styles.notificationItemUnread : null
                ]}
              >
                <View style={styles.notificationDotCol}>
                  {item.unread && <View style={styles.unreadDot} />}
                </View>
                <View style={styles.notificationContentCol}>
                  <Text style={styles.notificationItemTitle}>{item.title}</Text>
                  <Text style={styles.notificationItemDesc}>{item.desc}</Text>
                  <Text style={styles.notificationItemTime}>{item.time}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    paddingTop: Platform.OS === 'ios' ? 10 : 0, // adjust iOS height spacing
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
    transform: [{ translateX: -40 }],
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    position: 'relative',
  },
  bagIcon: {
    marginLeft: 10,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 2,
    backgroundColor: '#E01E35',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bagBadge: {
    right: -2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
  },
  // Modal Base Styles
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 0.5,
  },
  closeModalButton: {
    padding: 6,
  },
  // Cart Modal Styles
  cartContentContainer: {
    flex: 1,
  },
  cartItemsScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  cartItemCard: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F6F6F6',
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 2,
  },
  cartItemSub: {
    fontSize: 11,
    color: '#8D8D8D',
    fontWeight: '500',
    marginBottom: 4,
  },
  cartItemDetails: {
    fontSize: 12,
    color: '#111111',
    fontWeight: '600',
    marginBottom: 6,
  },
  cartQuantityPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartItemQty: {
    fontSize: 12,
    color: '#8D8D8D',
    fontWeight: '600',
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },
  cartItemDelete: {
    padding: 8,
    marginLeft: 10,
  },
  cartSummaryContainer: {
    borderTopWidth: 1.5,
    borderTopColor: '#F0F0F0',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8D8D8D',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#111111',
    fontWeight: '700',
  },
  freeShipping: {
    color: '#2E7D32',
  },
  totalRow: {
    marginTop: 6,
    marginBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    fontSize: 16,
    color: '#111111',
    fontWeight: '800',
  },
  totalValue: {
    fontSize: 18,
    color: '#111111',
    fontWeight: '900',
  },
  checkoutButton: {
    backgroundColor: '#111111',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  // Empty Modal State
  emptyModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  emptyModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111111',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyModalSubtitle: {
    fontSize: 13,
    color: '#8D8D8D',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 28,
  },
  browseButton: {
    backgroundColor: '#111111',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  // Notifications Modal Styles
  notificationsScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 12,
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF5A00',
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  notificationItemUnread: {
    backgroundColor: '#F9F9F9',
  },
  notificationDotCol: {
    width: 16,
    alignItems: 'center',
    paddingTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5A00',
  },
  notificationContentCol: {
    flex: 1,
    paddingRight: 10,
  },
  notificationItemTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  notificationItemDesc: {
    fontSize: 13,
    color: '#444444',
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 6,
  },
  notificationItemTime: {
    fontSize: 11,
    color: '#8D8D8D',
    fontWeight: '600',
  },
  shippingSection: {
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  shippingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  shippingTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 0.5,
    marginLeft: 6,
  },
  shippingAddressText: {
    fontSize: 12,
    color: '#444444',
    fontWeight: '600',
    lineHeight: 16,
  },
  shippingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  shippingHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeAddressLinkText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF5A00',
    textDecorationLine: 'underline',
  },
  addressEditActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressActionBtn: {
    paddingVertical: 2,
  },
  addressActionSaveText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2E7D32',
  },
  addressActionCancelText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E01E35',
  },
  inlineAddressInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    color: '#111111',
    fontWeight: '500',
    marginTop: 4,
    minHeight: 40,
    textAlignVertical: 'top',
  },
});
