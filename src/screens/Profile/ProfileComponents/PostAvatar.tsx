import { View, Text, Image, Button, StyleSheet, TouchableOpacity, ImageBackground, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react';
import {FirebaseService} from '../../../services/firebase.service';
import TokenService from '../../../services/token.service';
import { NavigationProp } from '@react-navigation/native';
import  ProfileApi  from '../../../networking/profile.api';


interface PostingProps {
    compressedUri: string | null;
    setCompressedUri: (compressedUri: string|null) => void;
    navigation: NavigationProp<any>;
}

const PostAvatar = ({compressedUri,setCompressedUri, navigation} : PostingProps) => {
  const [avatar, setAvatar] = useState<string | null>(null); // Lưu đường dẫn ảnh avatar

   useEffect(() => {
          console.log('avatar:', avatar);
        }, [avatar]);

  //Hàm đăng ảnh
  async function putAvatar() {
    try {
      if (compressedUri) {
        // Upload the image to Firebase and get the URL
        const URL = await FirebaseService.uploadImage_avatar(compressedUri);
        const accessToken = await TokenService.getAccessToken();

        setAvatar(compressedUri); // Lưu đường dẫn ảnh avatar

        await ProfileApi.updateAvatar({
            urlPublicAvatar: URL?.urlPublicAvatar,
            pathAvatar: URL?.pathAvatar,
          })
          .then((response) => {
            console.log("Đăng ảnh thành công:", response.data);
            navigation.reset({
              index: 0,
              routes: [{ name: "Profile" }], // Đặt lại stack và chuyển đến màn hình Profile
            });
            setCompressedUri(null); // Reset the compressedUri after posting
          })
      }
      else {
        alert("Vui lòng chọn ảnh trước khi đăng ảnh");
      }
    } catch (error) {
      console.error("Lỗi khi đăng ảnh:", error);
    }
  }

  return (
    compressedUri ? (
      <View style={styles.container}>

        <ImageBackground source={{ uri: compressedUri }} style={styles.Image}></ImageBackground>

        <View style={styles.Button_container}>
            <TouchableOpacity style={styles.upload_button} onPress={() => putAvatar()}>
                <Image source={require("../../../assets/upload.png")} resizeMode="contain" style={{marginLeft:5 , width:50, height: 50 }}/>
            </TouchableOpacity>
        </View>
      </View>
    ) : (
      <View style={styles.container}>
        <Text>Chưa có ảnh nào được chụp</Text>
      </View>
    )
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      },
  Image: {
    width: 390,
    height: 390,
    borderRadius: 195,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
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

export default PostAvatar;