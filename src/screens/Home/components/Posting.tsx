import { View, Text, Image, Button, StyleSheet, TouchableOpacity, ImageBackground, TextInput, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react';
import {FirebaseService} from '../../../services/firebase.service';
import apiClient from '../../../networking/apiclient';
import TokenService from '../../../services/token.service';
import { CloudinaryService } from '../../../services/cloudinary.service';
import { Video } from 'react-native-video';
import ProfileService from '../../../services/profile.service';
import { useNavigation } from '@react-navigation/native';

interface PostingProps {
    compressedUri: string | null;
    setCompressedUri: (compressedUri: string|null) => void;
    setIsPosted: (isPosted: boolean) => void;
    setIsComfirmedPremium: (isComfirmedPremium: boolean) => void;
}

const Posting = ({compressedUri,setCompressedUri,setIsPosted,setIsComfirmedPremium} : PostingProps) => {
  const [caption, setCaption] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  //kiểm tra xem người dùng có phải là premium hay không
  const [isPremium, setIsPremium] = useState(false);
  ProfileService.isPremium()
    .then((isPremium) => {
      setIsPremium(isPremium);
    });

  //Hàm đăng bài
  async function post() {
    if (compressedUri?.endsWith('.mp4') || compressedUri?.endsWith('.mov')) {
      try {
        // Upload the video to Firebase and get the URL
        setIsLoading(true); // Bắt đầu loading
        if (isPremium === false) {
          Alert.alert(
            "Cần nạp Premium",
            "Bạn cần nâng cấp Premium để đăng video. Bạn có muốn nạp ngay không?",
            [
              {
                text: "Hủy",
                style: "cancel",
                onPress: () => {
                  setCompressedUri(null);
                }
              },
              {
                text: "Nạp ngay",
                onPress: () => {
                  setIsComfirmedPremium(true);
                  setCompressedUri(null);
                }
              }
            ]
          );
          return;
        }
        const URL = await CloudinaryService.uploadVideo_post(compressedUri);
        const accessToken = await TokenService.getAccessToken();

        console.log("URL", URL);
        await apiClient.post("/post/create", 
          {
            caption: caption,
            type: 'video',
            urlPublicVideo: URL?.urlPublicVideo,
            publicIdVideo : URL?.publicId,
          }, 
          {
            headers: {Authorization: `Bearer ${accessToken}`}
          })
          .then((response) => {
            console.log("Đăng bài thành công:", response.data);
            setIsPosted(true);
            setCompressedUri(null); // Reset the compressedUri after posting
          })
      } catch (error) {
        console.error("Lỗi khi đăng bài:", error);
      } finally {
        setIsLoading(false); // Kết thúc loading
      }
    } 
    else {
      try {
        if (compressedUri) {
          // Upload the image to Firebase and get the URL
          setIsLoading(true); // Bắt đầu loading
          const URL = await FirebaseService.uploadImage_post(compressedUri);
          const accessToken = await TokenService.getAccessToken();

          await apiClient.post("/post/create", 
            {
              caption: caption,
              type: 'image',
              urlPublicImage: URL?.urlPublicImage,
              pathImage : URL?.pathImage,
            }, 
            {
              headers: {Authorization: `Bearer ${accessToken}`}
            })
            .then((response) => {
              console.log("Đăng bài thành công:", response.data);
              setIsPosted(true);
              setCompressedUri(null); // Reset the compressedUri after posting
            })
        }
        else {
          alert("Vui lòng chọn ảnh trước khi đăng bài");
        }
      } catch (error) {
        console.error("Lỗi khi đăng bài:", error);
      } finally {
        setIsLoading(false); // Kết thúc loading
      }
    }
  }

  return (
    compressedUri ? (
      <View style={styles.Post_container}>

        {compressedUri.endsWith('.mp4') || compressedUri.endsWith('.mov') ? (
          // Hiển thị video nếu compressedUri là video
          <View style={{ position: 'relative', width: '100%', aspectRatio: 1 }}>
            <Video
              source={{ uri: compressedUri }}
              style={styles.Video}
              controls
              repeat
              resizeMode="cover"
            />
            <View style={styles.Overlay}>
              <TextInput
                style={[styles.TextInput, { width: Math.max(160, caption.length * 10) }]}
                placeholder="Thêm một tin nhắn"
                placeholderTextColor="white"
                value={caption}
                onChangeText={setCaption}
              />
            </View>
          </View>
        ) : (
          // Hiển thị hình ảnh nếu compressedUri là ảnh
          <ImageBackground source={{ uri: compressedUri }} style={styles.Image}>
            <TextInput
              numberOfLines={1}
              style={[styles.TextInput, { width: Math.max(160, caption.length * 10)}]}
              placeholder="Thêm một tin nhắn"
              placeholderTextColor="white"
              value={caption}
              onChangeText={setCaption}
            />
          </ImageBackground>
        )}

        <View style={styles.Button_container}>
            <TouchableOpacity style={styles.exit_button} onPress={() => setCompressedUri(null)}>
                <Image source={require("../../../assets/X.png")} resizeMode="contain" style={{ width:40, height: 40 }}/>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.upload_button}
              onPress={() => !isLoading && post()} // Chỉ gọi hàm post nếu không đang loading
              disabled={isLoading} // Vô hiệu hóa nút khi đang loading
            >
              {isLoading ? (
                <ActivityIndicator size={50} color="#ffffff" /> // Hiển thị spinner khi đang loading
              ) : (
                <Image
                  source={require("../../../assets/upload.png")}
                  resizeMode="contain"
                  style={{ marginLeft: 5, width: 50, height: 50 }}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.edit_button}>
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
  Video:{
    width: '100%',
    aspectRatio: 1,
    borderRadius: 60,
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  Overlay: {
    position: 'absolute', // Đặt vị trí tuyệt đối
    top: 10, // Khoảng cách từ trên xuống (tùy chỉnh)
    left: 10, // Khoảng cách từ trái sang (tùy chỉnh)
    right: 10, // Khoảng cách từ phải sang (tùy chỉnh)
    alignItems: 'center', // Căn giữa nội dung theo chiều ngang
  },
});

export default Posting