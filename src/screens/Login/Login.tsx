import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import { styles } from "./styles";
import * as Device from "expo-device";
import apiClient from "../../networking/apiclient";
import TokenService from "../../services/token.service";
import { StatusBar } from "expo-status-bar";

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
      const data = response.data;

      TokenService.saveTokens(data.accessToken, data.refreshToken);

      alert("Đăng nhập thành công!");

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error: any) {
      if (error.response) {
        if (error.response.data.message === "Unauthorized") {
          alert("Tài khoản hoặc mật khẩu không đúng.");
        }
      } else if (error.request) {
        alert("Không kết nối được đến server, vui lòng kiểm tra mạng!");
      } else {
        alert("Đã xảy ra lỗi, vui lòng thử lại!");
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Welcome")}
                style={styles.backButton}
                activeOpacity={0.6}
              >
                <Ionicons name="arrow-back" size={26} color="#000" />
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
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Đăng nhập</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;
