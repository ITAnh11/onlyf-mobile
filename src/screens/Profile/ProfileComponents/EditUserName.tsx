import React, { useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform} from 'react-native';
import ProfileApi from '../../../networking/profile.api';

const EditUserName = ({ navigation }: any) => {
  const [username, setUserName] = useState(''); // Giá trị ban đầu có thể lấy từ props hoặc API

  const handleSave = async () => {
    try {
      await ProfileApi.updateProfile({
        username
      });

      Alert.alert('Thành công', 'Đã cập nhật username!');
      navigation.reset({
        index: 0,
        routes: [{ name: "Profile" }], // Đặt lại stack và chuyển đến màn hình Profile
      });
    } catch (error) {
      console.error('Error updating username:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật username. Vui lòng thử lại.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'android' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Sửa tên người dùng của bạn</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên người dùng"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUserName}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Lưu</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default EditUserName;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#2b2b2b',
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#fcb900',
    paddingVertical: 16,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
});
