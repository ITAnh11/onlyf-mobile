import React, { useState } from "react";
import { Keyboard, ScrollView, StatusBar, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import { set } from "lodash";
import { useRoute } from "@react-navigation/native";

type Props = {
    navigation: any;
};

const Activate: React.FC<Props> = ({navigation}) => {  
    const [otp, setOtp] = useState("");

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
                            <Ionicons name="arrow-back" size={26} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Nhập mã OTP</Text>
                    </View>

                    <View style={styles.body}>
                        <View style={styles.content}>
                            <Text style={{fontSize: 17, marginBottom: 1}}>Nhập mã OTP được gửi tới email của bạn</Text>
                            <Text style={{fontSize: 15, marginBottom: 1}}>...@gmail.com</Text>
                            <Text style={{fontSize: 16, marginBottom: 30}}>Mã xác thực có giá trị trong 5 phút</Text>
                        
                            <TextInput
                                style={styles.input}
                                placeholder="Mã OTP"
                                value={otp}
                                onChangeText={setOtp}
                                secureTextEntry
                            />
                            <TouchableOpacity style={styles.link} onPress={() => {}}>
                                <Text style={styles.link}>Gửi lại mã xác thực</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => {}}>
                                <Text style={styles.buttonText}>Xác nhận</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                </ScrollView>
            </View>
         </TouchableWithoutFeedback>
    );
}

export default Activate;