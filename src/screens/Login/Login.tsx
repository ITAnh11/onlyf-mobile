import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import { CommonActions, NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import * as Device from "expo-device";
import apiClient from "../../networking/apiclient";
import TokenService from "../../services/token.service";

type Props = {
  navigation: NavigationProp<any>;
};

const Login: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleLogin = async () => {
  
    try {
      const deviceInfo = {
        brand: Device.brand, 
        model: Device.modelName, 
        os: Device.osName, 
        osVersion: Device.osVersion, 
        };

        const response = await apiClient.post("/auth/login", {
          email,
          password,
          deviceInfo,
        });
        const data = await response.data;

        TokenService.saveTokens(data.accessToken, data.refreshToken);
        
        await alert("Đăng nhập thành công!" );

        await navigation.reset(
            {
                index: 0,
                routes: [{ name: "Home" }],
            }
        )
        
    } catch (error : any) {
        if (error.response) {
            // Server đã phản hồi nhưng với mã lỗi (4xx, 5xx)
            console.error("Lỗi từ server:", error.response.data);
            if(error.response.data.message == "Unauthorized") {
                alert("Tài khoản hoặc mật khẩu không đúng.");
            }
        } else if (error.request) {
            // Yêu cầu đã được gửi nhưng không nhận phản hồi
            console.error("Không nhận được phản hồi từ server:", error.request);
            alert("Không kết nối được đến server, vui lòng kiểm tra mạng!");
        } else {
            // Lỗi khác (ví dụ lỗi khi cấu hình request)
            console.error("Lỗi khác:", error.message);
            alert("Đã xảy ra lỗi, vui lòng thử lại!");
        }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Đăng nhập</Text>
        </View>

        <View style={styles.body}>
            <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}    
        </View>

        <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={() => {handleLogin()}}>
            <Text style={styles.buttonText}>Đăng nhập</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Register")}> 
            <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
            </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;
