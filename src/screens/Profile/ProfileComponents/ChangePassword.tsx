import React, { useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform} from 'react-native';
import ProfileApi from '../../../networking/profile.api';

const ChangePassword = ({ navigation }: any) => {
  const [password, setPassword] = useState('');  // Giá trị ban đầu có thể lấy từ props hoặc API
  const [confirmPassword, setConfirmPassword] = useState('');

  // Cập nhật mât khẩu cũ 
  useEffect(() => {
    setPassword(`${password}`.trim());
  }, [password]);

  // Cập nhật mât khẩu mới
  useEffect(() => {
    setConfirmPassword(`${confirmPassword}`.trim());
  }, [confirmPassword]);

  const handleSave = async () => {
    try {
      await ProfileApi.changePassword({
        password,
        confirmPassword
      });

      Alert.alert('Thành công', 'Đã cập nhật đổi mật khẩu!');
      navigation.reset({
        index: 0,
        routes: [{ name: "Profile" }], // Đặt lại stack và chuyển đến màn hình Profile
      });
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật mật khẩu. Vui lòng thử lại.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'android' ? 'padding' : undefined}
    >
      {/* Nút quay lại */}
       <TouchableOpacity style={[styles.backButton]} onPress={() => navigation.goBack()}>
       <Text style={styles.backButtonText}>Quay lại</Text>
       </TouchableOpacity>
      <Text style={styles.title}>Sửa mật khẩu của bạn</Text>

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu mới"
        placeholderTextColor="#aaa"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Lưu</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute', // Đặt vị trí tuyệt đối
    top: 20, // Cách mép trên màn hình 20px
    left: 20, // Cách mép trái màn hình 20px
    backgroundColor: '#444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
