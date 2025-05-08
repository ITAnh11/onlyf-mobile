import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FriendItem } from './Type'
import { ScrollView } from 'react-native-gesture-handler';
import ProfileService from '../../../services/profile.service';

interface ButtonListProps {
  friendList: FriendItem[];
  setChoosing: (choosing : boolean) => void;
  setChoosedItem: (choosedItem : string) => void;
  idItem : string;
  setIdItem: (idItem : string) => void;
}

const Choose = (key: string, name : string , idItem: string, setChoosing: (choosing: boolean) => void, setChoosedItem: (choosedItem : string) => void, setIdItem: (idItem : string) => void,) => {
  if(key === idItem){
    setChoosing(false);
  } else {
    setIdItem(key);
    setChoosedItem(name);
    setChoosing(false);
  }
};

const ButtonList = ({ friendList, setChoosing, setChoosedItem, setIdItem, idItem }: ButtonListProps) => {
    const [userId, setUserID] = useState<string | number>(); // State để lưu tên người dùng
    // lấy thông tin người dùng từ ProfileService
    ProfileService.getId().then((id) => {
        if (id !== null) {
            setUserID(id.toString()); // Cập nhật state userId với giá trị từ ProfileService
        }
    });
    const [urlPublicAvatar, setUrlPublicAvatar] = useState<string | null>(null); // State để lưu tên người dùng
    // lấy thông tin người dùng từ ProfileService
    ProfileService.geturlPublicAvatar().then((url) => {
        if (url !== null) {
            setUrlPublicAvatar(url.toString()); // Cập nhật state userId với giá trị từ ProfileService
        }
    });

    useEffect(() => {
      console.log("userId", userId);
      console.log("urlPublicAvatar", urlPublicAvatar);
    },[userId, urlPublicAvatar]);
    
  return (
    <View style={styles.container}>
      <ScrollView style={styles.button_list}>
        <TouchableOpacity key="Tất cả bạn bè" style={styles.Item} onPress={() => Choose("Tất cả bạn bè", "Tất cả bạn bè", idItem, setChoosing, setChoosedItem, setIdItem)}>
          <View style = {{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={require("../../../assets/add-friend.png")} resizeMode="contain" style={{ width: 20, height: 20, marginLeft: 25 }} />
            <Text style = {styles.User_Name}>Tất cả bạn bè</Text>
          </View>
          <Image source={require("../../../assets/choose.png")} resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17 }} />
        </TouchableOpacity>
        <TouchableOpacity key="Bạn" style={styles.Item} onPress={() => Choose(`${userId}`, "Bạn", idItem, setChoosing, setChoosedItem, setIdItem)}>
          <View style = {{flexDirection: 'row', alignItems: 'center'}}>
            <ImageBackground
              source={
                urlPublicAvatar !== ""
                  ? { uri: urlPublicAvatar}
                  : require('../../../assets/user.png') // Sử dụng require cho hình ảnh cục bộ
              }
              resizeMode="contain"
              style={styles.User_Avatar}
            />
            <Text style = {styles.User_Name}>Bạn</Text>
          </View>
          <Image source={require("../../../assets/choose.png")} resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17 }} />
        </TouchableOpacity>
        {friendList.map((item) => (
          <TouchableOpacity key={item.friend.id} style={styles.Item} onPress={() => Choose(String(item.friend.id), item.friend.profile.name, idItem, setChoosing, setChoosedItem, setIdItem)}>
            {/* {item.friend.profile.name} */}
            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
              <ImageBackground
                source={
                  item.friend.profile.urlPublicAvatar
                    ? { uri: item.friend.profile.urlPublicAvatar }
                    : require('../../../assets/user.png') // Sử dụng require cho hình ảnh cục bộ
                }
                style={styles.User_Avatar}
              />
              <Text style = {styles.User_Name}>{item.friend.profile.name}</Text>
            </View>
            <Image source={require("../../../assets/choose.png")} resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17,}} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250, // Đặt chiều rộng cụ thể cho container
    height: 300, // Đặt chiều cao cụ thể cho container
    backgroundColor: '#656565',
    borderRadius: 25,
    overflow: 'hidden', // Đảm bảo nội dung không tràn ra ngoài
    marginTop: '30%',
  },
  button_list: {
    flexGrow: 0, // Ngăn ScrollView mở rộng toàn màn hình
  },
  Item: {
    backgroundColor: '#545454',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#111111',
    height: 60,
    alignItems:'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  User_Avatar: {
    marginLeft: 20,
    width: 35,
    height: 35,
    borderRadius: 30, 
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  User_Name: {
    marginLeft:20,
    color: 'white',
    fontWeight: 'bold',
  }
});

export default ButtonList