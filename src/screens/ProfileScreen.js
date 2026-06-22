import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useApp();
  
  // Edit Profile states
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(user ? user.name : '');
  const [editEmail, setEditEmail] = useState(user ? user.email : '');

  const handleEditSave = () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert('Error', 'Name and email cannot be empty');
      return;
    }
    
    const success = updateProfile(editName.trim(), editEmail.trim());
    if (success) {
      setIsEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    }
  };

  const handleOpenEdit = () => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
    }
    setIsEditModalVisible(true);
  };

  const menuItems = [
    { icon: 'receipt-outline', label: 'My Orders', detail: 'View history & track orders' },
    { icon: 'mail-outline', label: 'Inbox', detail: 'Promotions, news, and receipts' },
    { icon: 'barcode-outline', label: 'Nike Pass', detail: 'Member card QR & benefits' },
    { icon: 'settings-outline', label: 'Account Settings', detail: 'Privacy, password & address' }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* User Card */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop' }}
            style={styles.avatar}
          />
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
            <Pressable key={index} style={styles.menuItem}>
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

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <Pressable onPress={() => setIsEditModalVisible(false)} style={styles.closeModalButton}>
                <Ionicons name="close" size={24} color="#111111" />
              </Pressable>
            </View>

            {/* Modal Fields */}
            <View style={styles.modalForm}>
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

              {/* Save Button */}
              <Pressable style={styles.saveButton} onPress={handleEditSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </Pressable>
            </View>

          </View>
        </View>
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
    paddingBottom: 110, // accommodate bottom tab bar
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
  // Modal Styles
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
  },
  closeModalButton: {
    padding: 4,
  },
  modalForm: {
    paddingHorizontal: 24,
    paddingTop: 20,
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
  saveButton: {
    backgroundColor: '#111111',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
