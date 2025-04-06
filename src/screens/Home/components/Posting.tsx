import { View, Text, Image, Button, StyleSheet, TouchableOpacity, ImageBackground, TextInput } from 'react-native'
import React, { useState } from 'react';
import {FirebaseService} from '../../../services/firebase.service';
import apiClient from '../../../networking/apiclient';
import ProfileService from '../../../services/profile.service';
import TokenService from '../../../services/token.service';


interface PostingProps {
    compressedUri: string | null;
    setCompressedUri: (compressedUri: string|null) => void;
}

const Posting = ({compressedUri,setCompressedUri} : PostingProps) => {
  const [caption, setCaption] = useState<string>("");

  //Hàm trang trí bài post
  async function style_posting() {
    
  }

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

  return (
    compressedUri ? (
      <View style={styles.Post_container}>

        <ImageBackground source={{ uri: compressedUri }} style={styles.Image}>
          <TextInput
            style={[styles.TextInput, {width: Math.max(160, caption.length * 10)}]}
            placeholder="Thêm một tin nhắn"
            placeholderTextColor="white"
            value={caption}
            onChangeText={setCaption}
          />
        </ImageBackground>

        <View style={styles.Button_container}>
            <TouchableOpacity style={styles.exit_button} onPress={() => setCompressedUri(null)}>
                <Image source={require("../../../assets/X.png")} resizeMode="contain" style={{ width:40, height: 40 }}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.upload_button} onPress={() => post()}>
                <Image source={require("../../../assets/upload.png")} resizeMode="contain" style={{marginLeft:5 , width:50, height: 50 }}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.edit_button} onPress={() => style_posting()}>
                <Image source={require("../../../assets/Edit.png")} resizeMode="contain" style={{ width:50, height: 50 }}/>
            </TouchableOpacity>
        </View>
      </View>
    ) : (
      <View style={styles.Post_container}>
        <Text>Chưa có ảnh nào được chụp</Text>
      </View>
    )
  );
}

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

export default Posting