import React, { useState, ComponentProps } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Switch,
  Platform,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../context/AppContext';

export default function ProfileScreen() {
  const { user, logout, updateProfile, orders } = useApp();
  
  // Single Modal Manager State
  // Values: null, 'edit', 'orders', 'inbox', 'pass', 'settings'
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Edit Profile form states
  const [editName, setEditName] = useState(user ? user.name : '');
  const [editEmail, setEditEmail] = useState(user ? user.email : '');
  const [editAddress, setEditAddress] = useState(user ? user.address : '');
  const [editAvatar, setEditAvatar] = useState<string | null>(user ? user.avatar : null);

  // Password edit form states
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Account settings switch states
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailOffers, setEmailOffers] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Gallery Picker Function
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'We need access to your library to choose a profile photo. Please enable it in device settings.'
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setEditAvatar(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery.');
    }
  };

  // Camera Capture Function
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'We need access to your camera to snap a photo. Please enable it in device settings.'
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setEditAvatar(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo with camera.');
    }
  };

  const handleEditSave = () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert('Error', 'Name and email cannot be empty');
      return;
    }
    
    let passwordToUpdate = null;
    if (showPasswordFields) {
      if (!currentPasswordInput || !newPassword || !confirmNewPassword) {
        Alert.alert('Error', 'Please fill in all password fields');
        return;
      }
      if (user && currentPasswordInput !== user.password) {
        Alert.alert('Error', 'Current password is incorrect');
        return;
      }
      if (newPassword.length < 6) {
        Alert.alert('Error', 'New password must be at least 6 characters');
        return;
      }
      if (newPassword !== confirmNewPassword) {
        Alert.alert('Error', 'New passwords do not match');
        return;
      }
      passwordToUpdate = newPassword;
    }
    
    const success = updateProfile(editName.trim(), editEmail.trim(), editAddress.trim(), editAvatar, passwordToUpdate);
    if (success) {
      setActiveModal(null);
      Alert.alert('Success', 'Profile updated successfully!');
    }
  };

  const handleOpenEdit = () => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
      setEditAddress(user.address || '');
      setEditAvatar(user.avatar || null);
    }
    setCurrentPasswordInput('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowPasswordFields(false);
    setActiveModal('edit');
  };

  const handleSaveSettings = () => {
    setActiveModal(null);
    Alert.alert('Success', 'Account settings saved successfully!');
  };

  type IoniconName = ComponentProps<typeof Ionicons>['name'];

  const menuItems: { icon: IoniconName; label: string; detail: string; type: string }[] = [
    { icon: 'receipt-outline', label: 'My Orders', detail: 'View history & track orders', type: 'orders' },
    { icon: 'mail-outline', label: 'Inbox', detail: 'Promotions, news, and receipts', type: 'inbox' },
    { icon: 'barcode-outline', label: 'Nike Pass', detail: 'Member card QR & benefits', type: 'pass' },
    { icon: 'settings-outline', label: 'Account Settings', detail: 'Privacy, password & address', type: 'settings' }
  ];

  const renderBarcode = () => {
    const bars = [
      1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 1, 4, 1, 2, 1
    ];
    return (
      <View style={styles.barcodeContainer}>
        {bars.map((weight, i) => (
          <View
            key={i}
            style={[
              styles.barcodeBar,
              { width: weight, backgroundColor: '#111111', marginRight: i % 3 === 0 ? 3 : 1 }
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* User Card */}
        <View style={styles.profileHeader}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={40} color="#8D8D8D" />
            </View>
          )}
          <Text style={styles.userName}>{user ? user.name : 'Nike Member'}</Text>
          <Text style={styles.userEmail}>{user ? user.email : 'member@nike.com'}</Text>
          <Text style={styles.memberSince}>Nike Member since 2026</Text>
          
          <Pressable style={styles.editButton} onPress={handleOpenEdit}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Menu list */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              style={styles.menuItem}
              onPress={() => setActiveModal(item.type)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={22} color="#111111" style={styles.menuIcon} />
                <View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuDetail}>{item.detail}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8D8D8D" />
            </Pressable>
          ))}
        </View>

        {/* Logout Button */}
        <Pressable style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#E01E35" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>

      </ScrollView>

      {/* ==================== EDIT PROFILE MODAL ==================== */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={activeModal === 'edit'}
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.editModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <Pressable onPress={() => setActiveModal(null)} style={styles.closeModalButton}>
                <Ionicons name="close" size={24} color="#111111" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScrollForm}>
              <View style={styles.modalForm}>
                
                {/* Profile Pic Editor / Preview */}
                <View style={styles.avatarEditContainer}>
                  {editAvatar ? (
                    <Image source={{ uri: editAvatar }} style={styles.editAvatarPreview} />
                  ) : (
                    <View style={styles.editAvatarPreviewPlaceholder}>
                      <Ionicons name="person" size={32} color="#8D8D8D" />
                    </View>
                  )}
                  <Text style={styles.photoInstructions}>Update your profile image for your Nike Pass and account view.</Text>
                </View>

                {/* Upload & Camera Buttons Row */}
                <View style={styles.photoActionsWrapper}>
                  <Pressable style={styles.photoActionBtn} onPress={takePhoto}>
                    <Ionicons name="camera-outline" size={20} color="#111111" />
                    <Text style={styles.photoActionText}>Take Photo</Text>
                  </Pressable>
                  
                  <Pressable style={styles.photoActionBtn} onPress={pickImage}>
                    <Ionicons name="image-outline" size={20} color="#111111" />
                    <Text style={styles.photoActionText}>From Gallery</Text>
                  </Pressable>

                  {editAvatar && (
                    <Pressable style={[styles.photoActionBtn, styles.photoActionDeleteBtn]} onPress={() => setEditAvatar(null)}>
                      <Ionicons name="trash-outline" size={20} color="#E01E35" />
                      <Text style={styles.photoActionDeleteText}>Remove</Text>
                    </Pressable>
                  )}
                </View>

                {/* Full Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={editName}
                    onChangeText={setEditName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>

                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={editEmail}
                    onChangeText={setEditEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Shipping Address */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Shipping Address</Text>
                  <TextInput
                    style={[styles.modalInput, styles.addressInput]}
                    value={editAddress}
                    onChangeText={setEditAddress}
                    multiline
                    numberOfLines={2}
                    placeholder="Street Address, City, State, ZIP"
                    placeholderTextColor="#8D8D8D"
                    autoCapitalize="words"
                  />
                </View>

                {/* Password Expandable checkbox */}
                <Pressable
                  style={styles.passwordToggleHeader}
                  onPress={() => setShowPasswordFields(!showPasswordFields)}
                >
                  <Ionicons
                    name={showPasswordFields ? 'checkbox' : 'square-outline'}
                    size={22}
                    color="#111111"
                    style={styles.passwordCheckbox}
                  />
                  <Text style={styles.passwordToggleText}>Change Password</Text>
                </Pressable>

                {showPasswordFields && (
                  <View style={styles.passwordFieldsContainer}>
                    {/* Current Password */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Current Password</Text>
                      <TextInput
                        style={styles.modalInput}
                        value={currentPasswordInput}
                        onChangeText={setCurrentPasswordInput}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>

                    {/* New Password */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>New Password</Text>
                      <TextInput
                        style={styles.modalInput}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Minimum 6 characters"
                        placeholderTextColor="#A0A0A0"
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>

                    {/* Confirm New Password */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Confirm New Password</Text>
                      <TextInput
                        style={styles.modalInput}
                        value={confirmNewPassword}
                        onChangeText={setConfirmNewPassword}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                  </View>
                )}

                <Pressable style={styles.saveButton} onPress={handleEditSave}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ==================== MY ORDERS MODAL ==================== */}
      <Modal
        animationType="slide"
        visible={activeModal === 'orders'}
        onRequestClose={() => setActiveModal(null)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>ORDER HISTORY</Text>
            <Pressable onPress={() => setActiveModal(null)} style={styles.closeModalButton}>
              <Ionicons name="close" size={24} color="#111111" />
            </Pressable>
          </View>

          {orders.length > 0 ? (
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {orders.map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderCardHeader}>
                    <Text style={styles.orderId}>Order ID: {order.id}</Text>
                    <Text style={styles.orderStatus}>{order.status}</Text>
                  </View>
                  <Text style={styles.orderDate}>Placed on: {order.date}</Text>

                  <View style={styles.orderItemsList}>
                    {order.items.map((item, index) => (
                      <View key={index} style={styles.orderItemRow}>
                        <Image source={{ uri: item.product.image }} style={styles.orderItemImage} />
                        <View style={styles.orderItemDetails}>
                          <Text style={styles.orderItemName} numberOfLines={1}>{item.product.name}</Text>
                          <Text style={styles.orderItemMeta}>
                            Size: {item.size}  |  Color: {item.color ? item.color.name : ''}
                          </Text>
                          <Text style={styles.orderItemPrice}>
                            Qty: {item.quantity}  •  ${item.product.price * item.quantity}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  <View style={styles.orderCardFooter}>
                    <Text style={styles.orderTotalLabel}>Total Amount Paid:</Text>
                    <Text style={styles.orderTotalVal}>${order.total}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyOrders}>
              <Ionicons name="receipt-outline" size={80} color="#E5E5E5" />
              <Text style={styles.emptyOrdersTitle}>No orders placed yet</Text>
              <Text style={styles.emptyOrdersSubtitle}>
                After you proceed to checkout in your shopping bag, your order history will appear here.
              </Text>
              <Pressable style={styles.modalCtaButton} onPress={() => setActiveModal(null)}>
                <Text style={styles.modalCtaText}>Back to Profile</Text>
              </Pressable>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* ==================== INBOX MODAL ==================== */}
      <Modal
        animationType="slide"
        visible={activeModal === 'inbox'}
        onRequestClose={() => setActiveModal(null)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>MEMBER INBOX</Text>
            <Pressable onPress={() => setActiveModal(null)} style={styles.closeModalButton}>
              <Ionicons name="close" size={24} color="#111111" />
            </Pressable>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.inboxCard}>
              <View style={styles.inboxDot} />
              <View style={styles.inboxContent}>
                <Text style={styles.inboxHeader}>EXCLUSIVE ACCESS: MEMBERSHIP PERK</Text>
                <Text style={styles.inboxText}>
                  Use coupon code <Text style={styles.boldText}>MEMBER10</Text> at checkout in your cart to receive a 10% discount on any running gear or sneakers.
                </Text>
                <Text style={styles.inboxDate}>June 22, 2026</Text>
              </View>
            </View>

            <View style={styles.inboxCard}>
              <View style={styles.inboxDot} />
              <View style={styles.inboxContent}>
                <Text style={styles.inboxHeader}>AIR JORDAN HIGH COPPED LIST</Text>
                <Text style={styles.inboxText}>
                  Exclusive release restocks are coming. Mark Jordan items in your favorites tab to receive alerts immediately before they drop.
                </Text>
                <Text style={styles.inboxDate}>June 20, 2026</Text>
              </View>
            </View>

            <View style={[styles.inboxCard, styles.inboxCardRead]}>
              <View style={styles.inboxContent}>
                <Text style={styles.inboxHeader}>WELCOME TO NIKE CLUB</Text>
                <Text style={styles.inboxText}>
                  Welcome, {user ? user.name : 'Nike Member'}! We are thrilled to have you in the fold. You will receive free shipping on all orders, early product releases, and member-only pricing campaigns.
                </Text>
                <Text style={styles.inboxDate}>June 18, 2026</Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ==================== NIKE PASS MODAL ==================== */}
      <Modal
        animationType="slide"
        visible={activeModal === 'pass'}
        onRequestClose={() => setActiveModal(null)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>NIKE PASS</Text>
            <Pressable onPress={() => setActiveModal(null)} style={styles.closeModalButton}>
              <Ionicons name="close" size={24} color="#111111" />
            </Pressable>
          </View>

          <View style={styles.passContainer}>
            <Text style={styles.passInstructions}>
              Scan this pass at checkout in any Nike Store to verify your membership perks, log store purchases, and unlock rewards.
            </Text>

            <View style={styles.passTicket}>
              <View style={styles.passTicketTop}>
                <View style={styles.passTicketBrand}>
                  <Text style={styles.passNikeText}>NIKE</Text>
                  <View style={styles.passOrangeDot} />
                </View>
                <Text style={styles.passMemberLabel}>MEMBER</Text>
              </View>

              <View style={styles.passTicketBody}>
                {user?.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.passAvatar} />
                ) : (
                  <View style={[styles.passAvatar, styles.passAvatarPlaceholder]}>
                    <Ionicons name="person" size={28} color="#8D8D8D" />
                  </View>
                )}
                <View style={styles.passMemberDetails}>
                  <Text style={styles.passName} numberOfLines={1}>{user ? user.name : 'Nike Member'}</Text>
                  <Text style={styles.passTier}>ALL-STAR TIER</Text>
                  <Text style={styles.passSince}>Member since 2026</Text>
                </View>
              </View>

              <View style={styles.ticketSeparator}>
                <View style={styles.ticketDotLeft} />
                <View style={styles.ticketDashLine} />
                <View style={styles.ticketDotRight} />
              </View>

              <View style={styles.passTicketBottom}>
                {renderBarcode()}
                <Text style={styles.passBarCodeText}>NK - 9823 4810 2341</Text>
              </View>
            </View>

            <Pressable style={styles.walletButton} onPress={() => Alert.alert('Saved!', 'Nike Pass has been saved to your Apple Wallet.')}>
              <Ionicons name="wallet-outline" size={20} color="#FFFFFF" style={styles.walletIcon} />
              <Text style={styles.walletText}>Add to Apple Wallet</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

      {/* ==================== ACCOUNT SETTINGS MODAL ==================== */}
      <Modal
        animationType="slide"
        visible={activeModal === 'settings'}
        onRequestClose={() => setActiveModal(null)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>ACCOUNT SETTINGS</Text>
            <Pressable onPress={() => setActiveModal(null)} style={styles.closeModalButton}>
              <Ionicons name="close" size={24} color="#111111" />
            </Pressable>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.settingsSectionTitle}>Preferences</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingTextCol}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDesc}>Receive order updates, releases, and favorites alerts.</Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: '#E5E5E5', true: '#111111' }}
                thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingTextCol}>
                <Text style={styles.settingLabel}>Email Promo Offers</Text>
                <Text style={styles.settingDesc}>Receive newsletter catalogs, receipts, and membership codes.</Text>
              </View>
              <Switch
                value={emailOffers}
                onValueChange={setEmailOffers}
                trackColor={{ false: '#E5E5E5', true: '#111111' }}
                thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingTextCol}>
                <Text style={styles.settingLabel}>High-Contrast Mode</Text>
                <Text style={styles.settingDesc}>Increase visibility of typography weights and backgrounds.</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#E5E5E5', true: '#111111' }}
                thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
              />
            </View>

            <Text style={styles.settingsSectionTitle}>Member Account</Text>

            <Pressable
              style={styles.settingsActionRow}
              onPress={() => Alert.alert('Privacy Policy', 'Nike is committed to protecting your personal information. Read details at nike.com/privacy.')}
            >
              <Text style={styles.settingsActionLabel}>Privacy & Data Policy</Text>
              <Ionicons name="chevron-forward" size={16} color="#8D8D8D" />
            </Pressable>

            <Pressable
              style={styles.settingsActionRow}
              onPress={() => Alert.alert('Region Selector', 'Region locked to: United States (EN). To modify, visit account details.')}
            >
              <Text style={styles.settingsActionLabel}>Location: United States (EN)</Text>
              <Ionicons name="chevron-forward" size={16} color="#8D8D8D" />
            </Pressable>

            <Pressable
              style={styles.settingsActionRow}
              onPress={() => Alert.alert('Member Level', 'Current member ranking status: Gold tier level.')}
            >
              <Text style={styles.settingsActionLabel}>Membership Perks Rank</Text>
              <Ionicons name="chevron-forward" size={16} color="#8D8D8D" />
            </Pressable>

            <Pressable style={styles.settingsSaveBtn} onPress={handleSaveSettings}>
              <Text style={styles.settingsSaveBtnText}>Save Preferences</Text>
            </Pressable>

          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  avatarPlaceholder: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#8D8D8D',
    fontWeight: '500',
    marginBottom: 6,
  },
  memberSince: {
    fontSize: 12,
    color: '#8D8D8D',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
    marginBottom: 20,
  },
  editButton: {
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F6F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 16,
    width: 24,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
  menuDetail: {
    fontSize: 12,
    color: '#8D8D8D',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#FFD2D2',
    backgroundColor: '#FFF5F5',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E01E35',
  },
  // Modal Base Styles
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  editModalContent: {
    maxHeight: '88%',
  },
  modalScrollForm: {
    flexGrow: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
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
    padding: 4,
  },
  modalForm: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111111',
    fontWeight: '500',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  addressInput: {
    height: 64,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#111111',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  // Avatar Editor Styles
  avatarEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  editAvatarPreview: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
  },
  editAvatarPreviewPlaceholder: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#F6F6F6',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoInstructions: {
    fontSize: 12,
    color: '#8D8D8D',
    flex: 1,
    marginLeft: 14,
    lineHeight: 16,
    fontWeight: '500',
  },
  photoActionsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  photoActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingVertical: 10,
    borderRadius: 20,
  },
  photoActionDeleteBtn: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FFD2D2',
  },
  photoActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
    marginLeft: 6,
  },
  photoActionDeleteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E01E35',
    marginLeft: 6,
  },
  // Password Collapsible Styles
  passwordToggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    paddingVertical: 6,
  },
  passwordCheckbox: {
    marginRight: 10,
  },
  passwordToggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
  },
  passwordFieldsContainer: {
    borderLeftWidth: 2,
    borderLeftColor: '#111111',
    paddingLeft: 16,
    marginLeft: 10,
    marginBottom: 10,
  },
  // My Orders Modal Styles
  orderCard: {
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF5A00',
    textTransform: 'uppercase',
  },
  orderDate: {
    fontSize: 12,
    color: '#8D8D8D',
    fontWeight: '600',
    marginBottom: 14,
  },
  orderItemsList: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    paddingVertical: 12,
    marginBottom: 12,
  },
  orderItemRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  orderItemImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#F6F6F6',
  },
  orderItemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  orderItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
  },
  orderItemMeta: {
    fontSize: 11,
    color: '#8D8D8D',
    fontWeight: '500',
    marginTop: 2,
  },
  orderItemPrice: {
    fontSize: 11,
    color: '#111111',
    fontWeight: '600',
    marginTop: 2,
  },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotalLabel: {
    fontSize: 13,
    color: '#8D8D8D',
    fontWeight: '600',
  },
  orderTotalVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
  emptyOrders: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  emptyOrdersTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111111',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyOrdersSubtitle: {
    fontSize: 13,
    color: '#8D8D8D',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 28,
  },
  modalCtaButton: {
    backgroundColor: '#111111',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
  },
  modalCtaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  // Inbox Modal Styles
  inboxCard: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#FFFBF9',
  },
  inboxCardRead: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F0F0F0',
  },
  inboxDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5A00',
    marginTop: 4,
    marginRight: 10,
  },
  inboxContent: {
    flex: 1,
  },
  inboxHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  inboxText: {
    fontSize: 13,
    color: '#444444',
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 6,
  },
  boldText: {
    fontWeight: '800',
    color: '#111111',
  },
  inboxDate: {
    fontSize: 11,
    color: '#8D8D8D',
    fontWeight: '600',
  },
  // Nike Pass Modal Styles
  passContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
    alignItems: 'center',
  },
  passInstructions: {
    fontSize: 13,
    color: '#8D8D8D',
    textAlign: 'center',
    lineHeight: 19,
    fontWeight: '500',
    marginBottom: 30,
  },
  passTicket: {
    width: '100%',
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  passTicketTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  passTicketBrand: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  passNikeText: {
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  passOrangeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FF5A00',
    marginLeft: 2,
  },
  passMemberLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF5A00',
    letterSpacing: 1,
  },
  passTicketBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  passAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  passAvatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passMemberDetails: {
    marginLeft: 16,
    flex: 1,
  },
  passName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  passTier: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8D8D8D',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  passSince: {
    fontSize: 10,
    color: '#8D8D8D',
    fontWeight: '500',
  },
  ticketSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: -24,
    marginBottom: 24,
  },
  ticketDotLeft: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginLeft: -8,
  },
  ticketDashLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#333333',
    borderStyle: 'dashed',
  },
  ticketDotRight: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginRight: -8,
  },
  passTicketBottom: {
    alignItems: 'center',
  },
  barcodeContainer: {
    flexDirection: 'row',
    height: 54,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'stretch',
    marginBottom: 10,
  },
  barcodeBar: {
    height: '100%',
  },
  passBarCodeText: {
    fontSize: 11,
    color: '#8D8D8D',
    fontWeight: '700',
    letterSpacing: 2,
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 40,
  },
  walletIcon: {
    marginRight: 10,
  },
  walletText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  // Account Settings Styles
  settingsSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8D8D8D',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: '#F6F6F6',
  },
  settingTextCol: {
    flex: 1,
    paddingRight: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 11,
    color: '#8D8D8D',
    lineHeight: 16,
    fontWeight: '500',
  },
  settingsActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1.5,
    borderBottomColor: '#F6F6F6',
  },
  settingsActionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
  },
  settingsSaveBtn: {
    backgroundColor: '#111111',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  settingsSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 16,
  },
});
