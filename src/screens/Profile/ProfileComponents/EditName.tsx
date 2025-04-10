import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ProfileService from '../../../services/profile.service'; // Import ProfileService

const EditName: React.FC = () => {
  const [firstName, setFirstName] = useState<string>(''); // Tên
  const [lastName, setLastName] = useState<string>(''); // Họ

  // Hàm lưu tên và họ mới
  const saveNewName = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Lỗi', 'Tên và họ không được để trống.');
      return;
    }

    try {
      await ProfileService.updateProfile({ name: `${firstName} ${lastName}` }); // Cập nhật tên đầy đủ
      Alert.alert('Thành công', 'Tên người dùng đã được cập nhật.');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật tên người dùng.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nhập tên:</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên"
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      />

      <Text style={styles.label}>Nhập họ:</Text>
      <TextInput
        style={styles.input}
        placeholder="Họ"
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveNewName}>
        <Text style={styles.buttonText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111111',
    padding: 20,
  },
  label: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default EditName;