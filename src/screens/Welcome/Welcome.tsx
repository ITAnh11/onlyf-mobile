import React from "react";
import {View, TouchableOpacity, Text, Image, Button} from "react-native";
import {styles} from "./styles";
import { NavigationProp } from "@react-navigation/native";

type Props = {
    navigation: NavigationProp<any>; 
};

const Welcome: React.FC<Props> = ({ navigation }) => {
    return (
        <TouchableOpacity style={styles.container}>
            <View>
                <Text style={styles.title}>Chào mừng bạn đến với OnlyF!</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress = {() => navigation.navigate("Login")}>
                <Text style={styles.buttonText}>Đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress = {() => navigation.navigate("Register")}>  
                <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

export default Welcome;