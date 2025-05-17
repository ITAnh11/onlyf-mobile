import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { PostItem } from './Type';
import Video from 'react-native-video';

interface AllImageViewProps {
  setIsAllImageView: (isAllImageView: boolean) => void;
  danhSach: PostItem[];
  fetchCards: () => void;
  idItem: string;
  setBackToHomePage: (backToHomePage : boolean) => void;
  setIsLinkToPostView: (isLinkToPostView : boolean) => void;
  setPostIndexToLink: (postIndexToLink : number) => void;
}

const AllImageView = ({ setIsAllImageView, danhSach, fetchCards, idItem, setBackToHomePage, setIsLinkToPostView, setPostIndexToLink }: AllImageViewProps) => {

  // Hàm render các ảnh
  const renderItem = ({ item, index }: { item: PostItem, index : number }) => {
    return (
      <View style={{ flex: 1, margin: 3, aspectRatio: 1 }}>
        <TouchableOpacity onPress={() => {setPostIndexToLink(index), setIsAllImageView(false), setIsLinkToPostView(true)}}>
        {item.type === 'image' ? (
          <ImageBackground
            source={{ uri: item.urlPublicImage }}
            resizeMode="cover"
            style={{ height: '100%', overflow: 'hidden', aspectRatio: 1, borderRadius: 10 }}
          />
        ):(
          <View style={{ height: '100%', overflow: 'hidden', aspectRatio: 1, borderRadius: 10 }}>
            <Video
              style={{ height: '100%', overflow: 'hidden', aspectRatio: 1, borderRadius: 10 }}
              source={{ uri: item.urlPublicVideo }}
              paused={true} // Tạm dừng video 
              controls={false} // Ẩn các nút điều khiển
              resizeMode="cover"
            />
          </View>
        )}          
        </TouchableOpacity>
      </View>
    );
  };

  // Theo dõi sự thay đổi của danhSach và cuộn về đầu danh sách
  const flatListRef = useRef<FlatList<PostItem>>(null); // Tạo ref cho FlatList
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true }); // Cuộn về đầu danh sách
    }
  }, [idItem]);

  return (
    <SafeAreaView style={{ flexDirection: 'column', height: Dimensions.get('screen').height, flex: 1 }}>
      <FlatList
        ref={flatListRef} // Gắn ref vào FlatList
        data={danhSach.slice(1)}
        numColumns={3}
        style={styles.container}
        renderItem={({ item, index }) => renderItem({ item, index })}
        onEndReached={fetchCards}
        onEndReachedThreshold={0.2}
      />
      <TouchableOpacity style = {{position: 'absolute', zIndex: 10, marginLeft: Dimensions.get('screen').width/2 - 30, marginTop: Dimensions.get('screen').height * 0.87}} onPress={() => {setBackToHomePage(true); setIsAllImageView(false)}}>
        <View style={{ width: 60, height: 60, backgroundColor: '#EAA905', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 53, height: 53, backgroundColor: 'white', borderRadius: 50, alignItems: 'center', justifyContent: 'center',borderWidth: 3, borderColor: "black" }}/>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 130,
    paddingLeft: 5,
    paddingRight: 5,
  },
});

export default AllImageView;