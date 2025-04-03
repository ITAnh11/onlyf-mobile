import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';


interface CustomCameraProps {
  onPhotoTaken: (compressedUri: string) => void;
}

const CustomCamera: React.FC<CustomCameraProps> = ({ onPhotoTaken }) => {
    const [photo, setPhoto] = useState<string | null>(null);
    const cameraRef = useRef<CameraView>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>('back');
  //yêu cầu quyền truy cập camera
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Chúng tôi cần quyền truy cập camera</Text>
        <Button onPress={requestPermission} title="Cấp quyền" />
      </View>
    );
  }

  // Hàm để chuyển đổi giữa camera trước và sau
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Hàm chụp ảnh
    async function takePicture() {
        if (cameraRef.current) {
            const photoData = await cameraRef.current.takePictureAsync();
            if (photoData && photoData.uri) {
                setPhoto(photoData.uri); // Lưu đường dẫn ảnh vào trạng thái
                const compressedUri = await compressImage(photoData.uri); // Nén ảnh
                onPhotoTaken(compressedUri); // Gọi hàm callback với đường dẫn ảnh đã nén
            }
        }
    }


    // Hàm nén ảnh trước khi upload
    async function compressImage(uri: string): Promise<string> {
        const result = await ImageManipulator.manipulateAsync(
          uri,
          [],
          {
            compress: 0.7, 
            format: ImageManipulator.SaveFormat.JPEG,
          }
        );
        return result.uri;
      }


  return (
    <View style={styles.container}>
        {photo ? (
        // Hiển thị ảnh đã chụp
            <Image source={{ uri: photo }} style={styles.camera} />
        ) : (
            // Hiển thị camera nếu chưa chụp ảnh
            <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
        )}
        {/* <CameraView style={styles.camera} facing={facing} />       */}
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.get_Picture_button} onPress={toggleCameraFacing}>
                <Image source={require("../assets/image_icon.png")} resizeMode="contain" style={{ width:30, height: 30 }}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.take_Picture_button} onPress={takePicture}>
                <Image source={require("../assets/camera.png")} resizeMode="contain" style={{ width:50, height: 50 }}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toggleCameraFacing_button} onPress={toggleCameraFacing}>
                <Image source={require("../assets/circular.png")} resizeMode="contain" style={{ width:30, height: 30 }}/>
            </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 60,
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  toggleCameraFacing_button: {
    width: '15%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
    borderRadius: '50%',
  },
  take_Picture_button: {
    width: '25%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: '50%',
    borderWidth: 5,
    borderColor: '#EAA905',
  },
  get_Picture_button: {
    width: '15%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
    borderRadius: '50%',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default CustomCamera;