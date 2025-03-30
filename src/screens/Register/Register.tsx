import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { API_URL } from "../../constants/config.constants";
import apiClient from "../../networking/apiclient";

type Props = {
  navigation: NavigationProp<any>;
};

const Register: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});


  const handleRegister = async () => {
      try {
        const response = await apiClient.post("auth/register", {email, password, confirmPassword, name, username, dob});
        navigation.reset(
            {
                index: 0,
                routes: [{ name: "Login" }],
            }
        )
        alert("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
      } catch (error : any) {
        if (error.response) {
            // Server đã phản hồi nhưng với mã lỗi (4xx, 5xx)
            console.error("Lỗi từ server:", error.response.data);
            alert(error.response.data.message);
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
          <Text style={styles.title}>Đăng ký</Text>
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
            placeholder="Tên"
            value={name}
            onChangeText={setName}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <TextInput
            style={styles.input}
            placeholder="Tên người dùng"
            value={username}
            onChangeText={setUsername}
            />
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

            <TextInput
            style={styles.input}
            placeholder="Ngày sinh (YYYY-MM-DD)"
            value={dob}
            onChangeText={setDob}
            />
            {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

            <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        </View>

        <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
            </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Register;


