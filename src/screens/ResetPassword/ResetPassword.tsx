import React, { useRef, useState } from "react";
import {
    Keyboard,
    ScrollView,
    StatusBar,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Text
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import apiClient from "../../networking/apiclient";
import Colors from "../../constants/Color";
import { useRoute } from "@react-navigation/native";

type Props = {
    navigation: any;
};

const ResetPassword: React.FC<Props> = ({ navigation }) => {
    const route = useRoute();
    const accessToken = (route.params as { accessToken: string })?.accessToken;
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async () => {
        try {
            const response = await apiClient.post("/user/reset-password", {
                password: password,
                confirmPassword: confirmPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            console.log(response.data);
            if (response.status === 201) {
                alert("Đặt lại mật khẩu thành công!");
                navigation.navigate("Login");
            } else {
                console.error("Lỗi từ server:", response.data);
                alert("Đã xảy ra lỗi 1");
            }
        }
        catch (error: any) {
            if (error.response) {
                console.error("Lỗi từ server:", error.response.data);
                alert("Đã xảy ra lỗi 2, vui lòng thử lại!");
            } else if (error.request) {
                alert("Không kết nối được đến server, vui lòng kiểm tra mạng!");
            } else {
                alert("Đã xảy ra lỗi 3, vui lòng thử lại!");
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
                    <StatusBar barStyle="default" />
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                            activeOpacity={0.6}
                        >
                            <Ionicons name="arrow-back" size={26} color={Colors.white_button} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Đặt lại mật khẩu</Text>
                    </View>

                    <View style={styles.body}>
                        <View style={styles.content}>
                            <Text style={styles.text}>Nhập mật khẩu mới</Text>
                            <TextInput
                                style={styles.input}
                                autoCapitalize="none"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                            <Text style={styles.text}>Nhập lại mật khẩu mới</Text>
                            <TextInput
                                style={styles.input}
                                autoCapitalize="none"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                            
                            <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
                                <Text style={styles.buttonText}>Lưu thay đổi</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                </ScrollView>
            </View>
         </TouchableWithoutFeedback>
    );
};

export default ResetPassword;
