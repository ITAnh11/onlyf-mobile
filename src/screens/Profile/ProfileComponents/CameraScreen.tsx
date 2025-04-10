import { View, Text, Image, Button, StyleSheet, TouchableOpacity, ImageBackground, TextInput } from 'react-native'
import React, { useState } from 'react';
import {FirebaseService} from '../../../services/firebase.service';
import apiClient from '../../../networking/apiclient';
import ProfileService from '../../../services/profile.service';
import TokenService from '../../../services/token.service';
import { useRoute } from '@react-navigation/native';
import CustomCamera from '../../../components/camera';


type CameraScreenRouteParams = {
    compressedUri: string | null;
    setCompressedUri: (uri: string | null) => void;
  };
  
  const CameraScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const route = useRoute();
    const { compressedUri, setCompressedUri } = route.params as CameraScreenRouteParams;
    const [caption, setCaption] = useState<string>('');

  //Hàm đăng bài
async function post() {
    try {
      if (compressedUri) {
        // Upload the image to Firebase and get the URL
        const URL = await FirebaseService.uploadImage_post(compressedUri);
        const accessToken = await TokenService.getAccessToken();

        await apiClient.post("/post/create", 
          {
            caption: caption,
            urlPublicImage: URL?.urlPublicImage,
            pathImage : URL?.pathImage,
          }, 
          {
            headers: {Authorization: `Bearer ${accessToken}`}
          })
          .then((response) => {
            console.log("Đăng bài thành công:", response.data);
            setCompressedUri(null); // Reset the compressedUri after posting
          })
      }
      else {
        alert("Vui lòng chọn ảnh trước khi đăng bài");
      }
    } catch (error) {
      console.error("Lỗi khi đăng bài:", error);
    }
  }

  // Nếu chưa có compressedUri, hiển thị camera
  if (!compressedUri) {
    return (
      <View style={styles.Post_container}>
        <CustomCamera
          onPhotoTaken={(uri: string) => {
            setCompressedUri(uri); // Lưu URI của ảnh đã chụp
            navigation.goBack();
          }}
        />
      </View>
    );
  }

  // Nếu đã có compressedUri, hiển thị ảnh và các nút
  return (
    <View style={styles.Post_container}>
        <CustomCamera
          onPhotoTaken={(uri: string) => {
            setCompressedUri(uri); // Lưu URI của ảnh đã chụp
            navigation.goBack();
          }}
        />
      </View>
  );
  };

const styles = StyleSheet.create({
    Post_container: { 
      flex: 1,
      justifyContent: 'space-between',
      flexDirection: 'column',
    },
    Image: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: 60,
      overflow: 'hidden',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    Button_container: {
      marginTop: 30,
      marginBottom: 15,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    exit_button: {
      width: '15%',
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
    },
    upload_button: {
      width: '25%',
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#333333',
      borderRadius: '50%',
    },
    edit_button: {
      width: '15%',
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
    },
    TextInput: {
      marginTop: 10,
      marginHorizontal: 20,
      padding: 10,
      borderRadius: 30,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      fontSize: 16,
      color: 'white',
      fontWeight: "bold",
      height: 45,
      marginBottom:20,
    },
  });

export default CameraScreen;