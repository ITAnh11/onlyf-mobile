import { View, Text, StyleSheet, } from 'react-native'
import React, { useState, useEffect } from 'react';
import ProfileCamera from '../../../components/profile_camera';
import PostAvatar from './PostAvatar';
import { NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Props = {
  navigation: NavigationProp<any>;
};
  
  const CameraScreen: React.FC<Props> = ({ navigation }) => {
    const [compressedUri, setCompressedUri] = useState<string | null>(null); 

    useEffect(() => {
      console.log('compressedUri:', compressedUri);
    }, [compressedUri]);

    return (
      <View style={styles.container}>
        {compressedUri ? (
          <View>
            <PostAvatar compressedUri={compressedUri} setCompressedUri={setCompressedUri} navigation={navigation} />
          </View>
        ) : (
          <View>
            <ProfileCamera onPhotoTaken={setCompressedUri} navigation={navigation} />
          </View>
        )}
      </View>
    );
  };

const styles = StyleSheet.create({
  camera_container: {
    width: 390,
    height: 390,
    borderRadius: 195,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 400,
},
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'black',
},
  });

export default CameraScreen;