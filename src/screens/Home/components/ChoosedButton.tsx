import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import React, { useState } from 'react';

const { width, height } = Dimensions.get('window');

interface ChoosedButtonProps {
  choosedItem: string;
  setChoosing: (choosing : boolean) => void
}

const ChoosedButton = ({choosedItem, setChoosing}:ChoosedButtonProps) => {
  return (
    <View style = {styles.choose_button}>
      <TouchableOpacity style = {styles.choose_button} onPress={() => setChoosing(true)}>
        <Text style = {styles.choose_button_text}>{choosedItem}</Text>
        <Image source={require("../../../assets/choose.png")} resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17 }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  choose_button:{
    flexDirection:"row",
    backgroundColor: '#333333',
    alignItems: 'center',
    borderRadius: 30,
  },
  choose_button_text: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 20,
    marginRight: 10,
    fontSize: 15,
    zIndex: 5,
  },
})

export default ChoosedButton;