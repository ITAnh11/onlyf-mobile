import React from "react";
import {View, TouchableOpacity, Text, Image, Button, StatusBar} from "react-native";
import {styles} from "./styles";
import { NavigationProp } from "@react-navigation/native";

type Props = {
    navigation: NavigationProp<any>; 
};

const Welcome: React.FC<Props> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle={'default'} />
            <View>
                <Text style={styles.title}>Chào mừng bạn đến với OnlyF!</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress = {() => navigation.navigate("Register")}>
                <Text style={styles.buttonText}>Tạo tài khoản</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress = {() => navigation.navigate("Login")}>  
                <Text style={styles.buttonLoginText}>Đăng nhập</Text>
            </TouchableOpacity>
        </View>
    );
}

export default Welcome;