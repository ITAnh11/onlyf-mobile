import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, Image, InteractionManager, Switch } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useMediaLibraryPermissions } from 'expo-image-picker';


interface CustomCameraProps {
  onPhotoTaken: (compressedUri: string) => void;
}

const CustomCamera = ({ onPhotoTaken }: CustomCameraProps) => {
    const [photo, setPhoto] = useState<string | null>(null);
    const cameraRef = useRef<CameraView>(null);
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraMode, setCameraMode] = useState(true); // Thêm state để quản lý chế độ camera, true là photo, false là video
    const [permission_library, requestPermission_library ] = useMediaLibraryPermissions();

  //quản lý trạng thái quay video
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState<any | null>(null); // Add state for video
  const [recordingTime, setRecordingTime] = useState(0); // Thời gian quay video (tính bằng giây)
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Hàm để chuyển đổi giữa chế độ chụp ảnh và quay video
  const toggleCameraMode = () => {
    setCameraMode((currentMode) => (currentMode === true ? false : true)); // Chuyển đổi giữa chế độ chụp ảnh và quay video
  };
  
  const startRecording = async () => {
    if (!cameraRef.current) {
      console.error('Camera không được khởi tạo.');
      return;
    }
    try {
      // Bắt đầu quay video
      console.log('Bắt đầu quay video...');
      setIsRecording(true);
      // Đặt thời gian quay video về 0 trước khi bắt đầu
      setRecordingTime(0);
      // Khởi tạo bộ đếm thời gian
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1); // Tăng thời gian mỗi giây
      }, 1000);

      const videoData = await cameraRef.current.recordAsync({
        maxDuration: 60, // Giới hạn thời gian quay video
      });
  
      if (videoData && videoData.uri) {
        console.log('📁 Video URI:', videoData.uri);
        setVideo(videoData.uri); // Lưu video vào state
        onPhotoTaken(videoData.uri); // Gọi hàm callback với đường dẫn video
      } else {
        console.error('❌ Video recording failed or returned undefined data.');
      }
    } catch (error) {
      console.error('❌ Lỗi quay video:', error);
    } finally {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!cameraRef.current) {
      console.error('Camera không được khởi tạo.');
      return;
    }

    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRecordingTime(0); // Đặt thời gian quay video về 0 khi dừng quay
    cameraRef.current.stopRecording();
  };

  //yêu cầu quyền truy cập camera
  if (!permission) {
    return <View />;
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

  // Hàm lấy ảnh từ thư viện
  async function pickImage() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images, // Chỉ chọn ảnh
    allowsEditing: true, // Cho phép chỉnh sửa ảnh
    aspect: [4, 4], // Tỉ lệ khung hình (tuỳ chọn)
    quality: 1, // Chất lượng ảnh (1 là cao nhất)
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const selectedImageUri = result.assets[0].uri; // Đường dẫn ảnh được chọn
    const compressedUri = await compressImage(selectedImageUri); // Gọi callback với đường dẫn ảnh
    onPhotoTaken(compressedUri); // Gọi hàm callback với đường dẫn ảnh đã nén
  }
}
      


  return (
    <View style={styles.container}>
        {photo ? (
        // Hiển thị ảnh đã chụp
            <Image source={{ uri: photo }} style={styles.camera} />
        ) : (
            // Hiển thị camera nếu chưa chụp ảnh
            <>
              {cameraMode === true ? (
                  <CameraView ref={cameraRef} style={styles.camera} facing={facing}/> 
              ) : (
                  <CameraView ref={cameraRef} style={styles.camera} facing={facing} mode="video" /> 
              )}
            
              <View style={styles.toggleCameraModeButton}>
                <Switch
                  trackColor={{ false: '#767577', true: '#81b0ff' }} // Màu nền thanh trượt khi tắt/bật
                  thumbColor={cameraMode === true ? '#f5dd4b' : '#f4f3f4'}     // Màu nút trượt (hình tròn nhỏ) tùy vào trạng thái
                  ios_backgroundColor="#3e3e3e"                      // Màu nền của switch trên iOS khi ở trạng thái tắt
                  onValueChange={toggleCameraMode}                       // Hàm xử lý khi người dùng bật/tắt switch
                  value={cameraMode}                                  // Giá trị hiện tại của switch (true/false)
                />
                <Text style={styles.toggleCameraModeText}>
                  {cameraMode === true ? 'Photo' : 'Video'}
                </Text>
              </View>

              {isRecording && (
                <View style={styles.recordingTimeContainer}>
                  <View style = {{height: 10, width: 10, borderRadius: 10, backgroundColor: 'red'}}></View>
                  <Text style={styles.recordingTimeText}>{formatTime(recordingTime)}</Text>
                </View>
              )}
            </>
        )}
        {/* <CameraView style={styles.camera} facing={facing} />       */}
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.get_Picture_button} onPress={pickImage}>
                <Image source={require("../assets/image_icon.png")} resizeMode="contain" style={{ width:30, height: 30 }}/>
            </TouchableOpacity>
            {
                cameraMode === true ? (
                    <TouchableOpacity onPress={takePicture}>
                        <View style={{ width: 100, height: 100, backgroundColor: '#EAA905', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ width: 92, height: 92, backgroundColor: 'white', borderRadius: 50, alignItems: 'center', justifyContent: 'center',borderWidth: 4, borderColor: "black" }}/>
                        </View>
                    </TouchableOpacity>
                ) : (            
                  <TouchableOpacity onPress={isRecording ? stopRecording : startRecording}>
                    <View style={{width: 100, height: 100, backgroundColor: isRecording ? 'red' : '#EAA905', borderRadius: 50,alignItems: 'center', justifyContent: 'center',}}>
                      <View style={{width: 92, height: 92, backgroundColor: 'white', borderRadius: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: 'black',}}>
                        {isRecording ? (
                          <Image source={require("../assets/triangle.png")} resizeMode="contain" style={{ width: 30, height: 30 }} />
                        ) : (
                          <Image source={require("../assets/square.png")} resizeMode="contain" style={{ width: 30, height: 30 }} />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
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
    marginTop: 80,
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
  toggleCameraModeButton: {
    position: 'absolute', // Đặt vị trí tuyệt đối
    top: 20, // Khoảng cách từ trên xuống
    right: 20, // Khoảng cách từ phải sang
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ
    padding: 10, // Khoảng cách bên trong nút
    borderRadius: 50, // Bo góc
    flexDirection: 'row', // Đặt các phần tử bên trong theo hàng ngang
    alignItems: 'center', // Căn giữa theo chiều dọc
  },
  toggleCameraModeText: {
    color: 'white', // Màu chữ
    fontWeight: 'bold', // Chữ đậm
    fontSize: 16, // Kích thước chữ
  },
  recordingTimeContainer: {
    position: 'absolute',
    top: 20, // Khoảng cách từ trên xuống (tùy chỉnh) 
    left: 20, // Khoảng cách từ trái sang (tùy chỉnh)
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row', 
  },
  recordingTimeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10, // Khoảng cách giữa biểu tượng và thời gian
  },
});

export default CustomCamera;