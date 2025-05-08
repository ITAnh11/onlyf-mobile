import { View, Text, Image, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, TextInput, Keyboard, KeyboardAvoidingView, Platform, Animated } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { PostItem } from './Type';
import apiClient from '../../../networking/apiclient';
import TokenService from '../../../services/token.service';
import Video from 'react-native-video';

type PostViewProps = {
  post: PostItem;
  setBackToHomePage: (backToHomePage : boolean) => void;
  setIsAllImageView : (isAllImageView : boolean) => void;
  currentPostId: string | null;
};

const PostView = ({ post, setBackToHomePage, setIsAllImageView, currentPostId }: PostViewProps) => {
  
  //theo dõi trạng thái của TextInput
  const [message, setMessage] = useState('');
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const handleShowInput = () => {
    setShowInput(true);
    setTimeout(() => {
      inputRef.current?.focus(); // đảm bảo TextInput đã render xong
    }, 100);
  };

  //Tạo state để quản lý danh sách emoji animation
  const [flyingEmojis, setFlyingEmojis] = useState<Array<{ id: number, emoji: string, y: Animated.Value, x: Animated.Value, opacity: Animated.Value }>>([]);
  const [flyingImages, setFlyingImages] = useState<Array<{ id: number, imageSource: any, y: Animated.Value, x: Animated.Value, opacity: Animated.Value }>>([]);
  //Hàm để tạo hiệu ứng bay lên cho emoji
  const triggerEmojiAnimation = (emoji: string) => {
    const newEmojis = Array.from({ length: 1 }).map(() => {
      const id = Date.now() + Math.random(); // Sử dụng thời gian hiện tại và giá trị ngẫu nhiên để tạo id duy nhất
      const y = new Animated.Value(0);
      const x = new Animated.Value(Math.random() * Dimensions.get('screen').width - Dimensions.get('screen').width / 2); // Bay ngẫu nhiên theo chiều ngang
      const opacity = new Animated.Value(1);
  
      return { id, emoji, y, x, opacity };
    });
  
    setFlyingEmojis((prev) => [...prev, ...newEmojis]);
  
    newEmojis.forEach(({ id, y, x, opacity }) => {
      const screenWidth = Dimensions.get('screen').width;
      Animated.parallel([
        Animated.timing(y, {
          toValue: -Dimensions.get('screen').height, // Bay hết màn hình
          duration: 1500, // Thời gian bay
          useNativeDriver: true,
        }),
        Animated.timing(x, {
          toValue: 1, // Giá trị cuối cùng để dao động
          duration: 2000, // Thời gian dao động
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 3000, // Mờ dần trong thời gian bay
          useNativeDriver: true,
        }),
      ]).start(() => {
        setFlyingEmojis((prev) => prev.filter(e => e.id !== id)); // Xóa emoji sau animation
      });
    });
  };

  const triggerImageAnimation = (imageSource: any) => {
    const newImages = Array.from({ length: 1 }).map(() => {
      const id = Date.now() + Math.random(); // Sử dụng thời gian hiện tại và giá trị ngẫu nhiên để tạo id duy nhất
      const y = new Animated.Value(0);
      const x = new Animated.Value(Math.random() * Dimensions.get('screen').width - Dimensions.get('screen').width / 2); // Bay ngẫu nhiên theo chiều ngang
      const opacity = new Animated.Value(1);
  
      return { id, imageSource, y, x, opacity };
    });
  
    setFlyingImages((prev) => [...prev, ...newImages]);
  
    newImages.forEach(({ id, y, x, opacity }) => {
      Animated.parallel([
        Animated.timing(y, {
          toValue: -Dimensions.get('screen').height, // Bay hết màn hình
          duration: 1500, // Thời gian bay
          useNativeDriver: true,
        }),
        Animated.timing(x, {
          toValue: 1, // Giá trị cuối cùng để dao động
          duration: 2000, // Thời gian dao động
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 3000, // Mờ dần trong thời gian bay
          useNativeDriver: true,
        }),
      ]).start(() => {
        setFlyingImages((prev) => prev.filter(e => e.id !== id)); // Xóa hình ảnh sau animation
      });
    });
  };


  //Hàm gửi reaction cho bài post
  const handleEmojiPress = async (emoji :string) => {
    try {
      triggerEmojiAnimation(emoji); // gọi hàm tạo hiệu ứng bay lên cho emoji
      const accessToken = await TokenService.getAccessToken();
      await apiClient.post('/react/create',
        {
          postId: post.id,
          type: emoji,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => {
          console.log("Gửi emoji thành công:", response.data);
        })
    } catch (error) {
      console.error('Lỗi khi gửi emoji:', error);
    }
  };

  // Hàm gửi comment cho bài post
  const handleSendComment = async () => {
    if (!message.trim()) return; // Không gửi nếu không có nội dung
    triggerImageAnimation(require('../../../assets/comment.png'));
    try {
      const accessToken = await TokenService.getAccessToken();
      await apiClient.post('/chat/reply-to-post',
        {
          receiverId: post.user.id,
          postId: post.id,
          text: message,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      console.log("Gửi Comment thành công");
      setMessage(''); // Xóa nội dung sau khi gửi
      setShowInput(false); // Ẩn TextInput sau khi gửi
      Keyboard.dismiss(); // Ẩn bàn phím
    } catch (error) {
      console.error('Lỗi khi gửi Comment:', error);
    }
  };

  return (
    <SafeAreaView style={{ flexDirection: "column", height: Dimensions.get('screen').height, flex: 1 }}>
      <View style={styles.Post_container}>
        {post.type === 'image' ? (
          <ImageBackground source={{ uri: post.urlPublicImage }} style={styles.Image}>
            { post.caption && <Text style={styles.Caption} numberOfLines={1} ellipsizeMode="tail" >{post.caption}</Text>}
          </ImageBackground>
        ):(
          <View style={{ position: 'relative', width: '100%', aspectRatio: 1 }}>
            <Video
              source={{ uri: post.urlPublicVideo }}
              style={styles.Video}
              controls
              repeat
              paused = {currentPostId !== post.id} // Tạm dừng video nếu không phải video hiện tại
              resizeMode="cover"
            />
            { post.caption && <Text style={{position:'absolute', alignSelf: 'center', top: 20, color: 'white', fontWeight: "bold", height: 45, overflow: 'hidden', fontSize: 16, backgroundColor: 'rgba(0, 0, 0, 0.3)', alignItems: 'center', borderRadius: 30, padding: 10, }} numberOfLines={1} ellipsizeMode="tail" >{post.caption}</Text>}
          </View>
        )}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, alignItems: 'center', marginBottom: 20,  }}>
          { post.user.profile.urlPublicAvatar !== null ?
            (
              <ImageBackground source={{ uri: post.user.profile.urlPublicAvatar }} style={styles.User_avatar} />
            ) : (
              <Image source={require("../../../assets/user.png")} style={styles.User_avatar} />
            )
          }
        <Text style={styles.User_name}>{post.user.profile.name}</Text>
      </View>

      {showInput && (
      <View 
      style={{
        position:'absolute', 
        zIndex: 10, 
        backgroundColor: "#333333", 
        height:  50,
        width: '90%', 
        borderRadius: 30, top: '70%', 
        paddingLeft: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: '5%',
        }}>
          <TextInput
            ref={inputRef}
            style={{ paddingLeft: 20, color: 'white', fontSize: 16, fontWeight: 'bold', width: "70%"}}
            placeholder="Nhập gì đó..."
            placeholderTextColor='#bfbebd'
            onChangeText={(text) => setMessage(text)}
            value={message}
            onBlur={() => {
              setMessage("");
              setShowInput(false); // Ẩn input khi không còn focus
            }}
            onSubmitEditing={handleSendComment} // Gửi comment khi nhấn Enter
            returnKeyType="send" // Hiển thị nút gửi trên bàn phím
            />
          <TouchableOpacity onPress={handleSendComment}>
            <ImageBackground source={require("../../../assets/upload.png")} resizeMode="contain" style={{ width: 30, height: 30, marginRight: 20 }} />
          </TouchableOpacity>
      </View>
      )}

      <View style={styles.Message_container}>
        <TouchableOpacity onPress={handleShowInput}>
          <Text style = {styles.Message}>Gửi tin nhắn...</Text>
        </TouchableOpacity>
        <View style={styles.Emoji_container}>
          {['❤️', '🔥', '😂', '😢'].map((emoji, index) => (
          <TouchableOpacity key={index} onPress={() => handleEmojiPress(emoji)}>
            <Text style={styles.Emoji}>{emoji}</Text>
          </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.Button_container}>
        <TouchableOpacity onPress={() => setIsAllImageView(true)} >
          <ImageBackground source={require("../../../assets/All_post_icon.png")} resizeMode="contain" style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setBackToHomePage(true)}>
          <View style={{ width: 60, height: 60, backgroundColor: '#EAA905', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 53, height: 53, backgroundColor: 'white', borderRadius: 50, alignItems: 'center', justifyContent: 'center',borderWidth: 3, borderColor: "black" }}/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <ImageBackground source={require("../../../assets/option.png")} resizeMode="contain" style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
      </View>
      {flyingEmojis.map((emoji) => (
        <Animated.Text
          key={emoji.id}
          style={{
            position: 'absolute',
            bottom: 0, // Vị trí bắt đầu của emoji
            left: Dimensions.get('screen').width / 2, // Vị trí ngang
            transform: [{ translateY: emoji.y }, { translateX: emoji.x }], // Hiệu ứng bay lên và ngang
            opacity: emoji.opacity, // Hiệu ứng mờ dần
            fontSize: 50, // Kích thước emoji
          }}
        >
          {emoji.emoji}
        </Animated.Text>
      ))}
      {flyingImages.map((image) => (
        <Animated.Image
          key={image.id}
          source={image.imageSource} // Hình ảnh được truyền vào
          style={{
            position: 'absolute',
            bottom: 0, // Vị trí bắt đầu của hình ảnh
            left: Dimensions.get('screen').width / 2, // Vị trí ngang
            transform: [{ translateY: image.y }, { translateX: image.x }], // Hiệu ứng bay lên và ngang
            opacity: image.opacity, // Hiệu ứng mờ dần
            width: 50, // Kích thước hình ảnh
            height: 50,
          }}
          resizeMode="contain"
        />
    ))}

    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  Post_container: { 
    justifyContent: 'space-between',
    flexDirection: 'column',
    marginTop: 120,
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
  Caption: {
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
    overflow: 'hidden',
  },
  User_name: {
    fontSize: 18,
    color: '#e0e0e0',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  User_avatar: {
    width: 30,
    height: 30,
    borderRadius: 15, 
    backgroundColor: '#333333',
    overflow: 'hidden',
  },
  Message_container:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: "#333333",
    height: 50,
    width: '90%',
    marginLeft: "5%",
    marginTop: "20%",
    borderRadius: 30,
  },
  Message: {
    fontSize: 18,
    color: '#bfbebd',
    marginLeft: 10,
    fontWeight: 'bold',
    backgroundColor: "#333333",
  },
  Emoji_container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '40%',
  },
  Emoji: {
    fontSize: 24,
  },
  Button_container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 25,
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
});
export default PostView