import { View, Text, ImageBackground, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Message from '../../Message';


type UserProfile = {
  name: string;
  urlPublicAvatar: string;
};

type User = {
  id: string;
  profile: UserProfile;
};

type PostItem = {
  id: string;
  caption: string;
  urlPublicImage: string;
  createdAt: string;
  user: User;
};
type PostViewProps = {
  post: PostItem;
};

const PostView = ({ post }: PostViewProps) => {
  return (
    <SafeAreaView style={{ flexDirection: "column", height: Dimensions.get('window').height, flex: 1 }}>
      <View style={styles.Post_container}>
        <ImageBackground source={{ uri: post.urlPublicImage }} style={styles.Image}>
           <Text style={styles.Caption}>{post.caption}</Text>
        </ImageBackground>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, alignItems: 'center', marginBottom: 20 }}>
        <ImageBackground source={{ uri: post.user.profile.urlPublicAvatar }} style={styles.User_avatar} />
        <Text style={styles.User_name}>{post.user.profile.name}</Text>
      </View>
      <View style={styles.Message_container}>
        <Text style={styles.Message}>Gửi tin nhắn...</Text>
        <View style={styles.Emoji_container}>
          <Text style={styles.Emoji}>❤️</Text>
          <Text style={styles.Emoji}>🔥</Text>
          <Text style={styles.Emoji}>😂</Text>
        </View>
      </View>
      <View style={styles.Button_container}>
        <TouchableOpacity >
          <ImageBackground source={require("../../../assets/All_post_icon.png")} resizeMode="contain" style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
        <TouchableOpacity >
          <View style={{ width: 60, height: 60, backgroundColor: '#EAA905', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 53, height: 53, backgroundColor: 'white', borderRadius: 50, alignItems: 'center', justifyContent: 'center',borderWidth: 3, borderColor: "black" }}/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <ImageBackground source={require("../../../assets/option.png")} resizeMode="contain" style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
      </View>

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
    backgroundColor: 'white',
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
});
export default PostView