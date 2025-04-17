import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { NavigationProp } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { API_URL } from "../../constants/config.constants";
import apiClient from "../../networking/apiclient";
import { navigate } from "../../navigation/NavigationService";
import Colors from "../../constants/Color";

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
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await apiClient.post("auth/register", { email, password, confirmPassword, name, username, dob });
      const getOtp = await apiClient.get("/auth/get-otp-mail-for-register", { params: { email } });
      navigate("Activate", { email: email });
    } catch (error: any) {
      if (error.response) {
        console.error("Lỗi từ server:", error.response.data);
        alert(error.response.data.message);
      } else if (error.request) {
        console.error("Không nhận được phản hồi từ server:", error.request);
        alert("Không kết nối được đến server, vui lòng kiểm tra mạng!");
      } else {
        console.error("Lỗi khác:", error.message);
        alert("Đã xảy ra lỗi, vui lòng thử lại!");
      }
    }
  };

  const handleConfirmDate = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Định dạng YYYY-MM-DD
    setDob(formattedDate);
    setDatePickerVisibility(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <StatusBar barStyle="light-content" />
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.navigate("Welcome")} style={styles.backButton} activeOpacity={0.6}>
                <Ionicons name="arrow-back" size={26} color={Colors.white_button} />
              </TouchableOpacity>
              <Text style={styles.title}>Đăng ký</Text>
            </View>

            <View style={styles.body}>
              <Text style={styles.textInput}>Email</Text>
              <TextInput style={styles.input} autoCapitalize="none" value={email} onChangeText={setEmail} />

              <Text style={styles.textInput}>Họ và tên</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} />

              <Text style={styles.textInput}>Tên người dùng</Text>
              <TextInput style={styles.input} value={username} onChangeText={setUsername} />

              <Text style={styles.textInput}>Ngày sinh</Text>
              <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.input}>
                <Text>{dob || "Chọn ngày sinh"}</Text> 
              </TouchableOpacity>

              <Text style={styles.textInput}>Mật khẩu</Text>
              <TextInput style={styles.input} autoCapitalize="none" value={password} onChangeText={setPassword} secureTextEntry />

              <Text style={styles.textInput}>Nhập lại mật khẩu</Text>
              <TextInput style={styles.input} autoCapitalize="none" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Đăng ký</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={new Date()}
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisibility(false)}
          themeVariant="light" 
          textColor="black" 
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Register;
