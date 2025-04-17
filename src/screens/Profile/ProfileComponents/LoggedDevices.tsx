import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import ProfileApi from '../../../networking/profile.api';

interface Device {
  id: string;
  deviceName: string;
  createdAt: string;
  userAgent: string;
}

const LoggedDevices = () => {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await ProfileApi.getLoggedDevices(); // API để lấy danh sách thiết bị
      console.log('Danh sách thiết bị:', response);
      setDevices(response.devices || []); // Giả sử API trả về danh sách thiết bị trong trường "devices"
    } catch (error) {
      console.error('Error fetching devices:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách thiết bị.');
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    try {
      await ProfileApi.deleteDevice(deviceId); // API để xóa thiết bị
      setDevices((prevDevices) => prevDevices.filter((device) => device.id !== deviceId));
      Alert.alert('Thành công', 'Thiết bị đã được xóa.');
    } catch (error) {
      console.error('Error deleting device:', error);
      Alert.alert('Lỗi', 'Không thể xóa thiết bị.');
    }
  };

  const handleDeleteAllDevices = async () => {
    try {
      await ProfileApi.deleteAllDevices(); // API để xóa tất cả thiết bị
      setDevices([]);
      Alert.alert('Thành công', 'Tất cả thiết bị đã được xóa.');
    } catch (error) {
      console.error('Error deleting all devices:', error);
      Alert.alert('Lỗi', 'Không thể xóa tất cả thiết bị.');
    }
  };

  const renderDevice = ({ item }: { item: Device }) => (
    <View style={styles.deviceContainer}>
      <View style={{ flex: 1 }}>
        <Text style={styles.deviceName}>Tên thiết bị:</Text>
        <Text style={styles.deviceName}>{item.deviceName}</Text>
        <Text style={styles.deviceInfo}>Hoạt động lần cuối:</Text>
        <Text style={styles.deviceInfo}>{item.createdAt}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteDevice(item.id)}
      >
        <Text style={styles.deleteButtonText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thiết bị đã đăng nhập</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDevice}
        contentContainerStyle={styles.list}
      />
      {devices.length > 0 && (
        <TouchableOpacity style={styles.deleteAllButton} onPress={handleDeleteAllDevices}>
          <Text style={styles.deleteAllButtonText}>Xóa tất cả</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default LoggedDevices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  list: {
    paddingBottom: 20,
  },
  deviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2b2b2b',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  deviceInfo: {
    fontSize: 14,
    color: '#aaa'
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  deleteAllButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  deleteAllButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});