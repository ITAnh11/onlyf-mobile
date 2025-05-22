import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import * as Device from "expo-device";
import apiClient from "../../networking/apiclient";
import TokenService from "../../services/token.service";
import { StatusBar } from "expo-status-bar";
import Colors from "../../constants/Color";

type Props = {
  navigation: NavigationProp<any>;
};

const Login: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    console.log("Current errors:", errors);
  }, [errors]);

  const handleLogin = async () => {
    setErrors({}); // clear errors
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
      console.log("Login response:", data);
      TokenService.saveTokens(data.accessToken, data.refreshToken);

      navigation.reset({
        index: 0,
        routes: [{ name: "Loading" }],
      });
    } catch (error: any) {
      console.log("Login error:", error?.response?.data || error.message);

      if (error.response) {
        const errorMessage = error.response.data.message;

        if (errorMessage === "Unauthorized" || errorMessage === "Invalid credentials") {
          setErrors({
            password: "Tài khoản hoặc mật khẩu không đúng.",
          });
        } else if (errorMessage === "User is not activated") {
          const otp = await apiClient.get("/auth/get-otp-mail-for-register", {
            params: { email },
          });
          if (otp.status === 200) {
            alert("Mã OTP đã được gửi đến email của bạn!");
          }
          navigation.navigate("Activate", { email });
        } else if (error.response.data.errors) {
          const apiErrors: { [key: string]: string } = {};
          for (const key in error.response.data.errors) {
            apiErrors[key] = error.response.data.errors[key][0];
          }
          setErrors(apiErrors);
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
        <StatusBar style="light" />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Welcome")}
                style={styles.backButton}
                activeOpacity={0.6}
              >
                <Ionicons name="arrow-back" size={26} color={Colors.white_button} />
              </TouchableOpacity>
              <Text style={styles.title}>Đăng nhập</Text>
            </View>

            <View style={styles.body}>
              <Text style={styles.textInput}>Email</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <Text style={styles.textInput}>Mật khẩu</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <TouchableOpacity
                style={styles.link}
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.link}>Quên mật khẩu?</Text>
              </TouchableOpacity>

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
