import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import { styles } from "./styles";
import { NavigationProp } from "@react-navigation/native";
import TokenService from "../../services/token.service";
import apiClient from "../../networking/apiclient";

type Props = {
    navigation: NavigationProp<any>; 
};

const Splash: React.FC<Props> = ({ navigation }) => {
    useEffect(() => {
        const checkLoginStatus = async () => {
            const refreshToken = await TokenService.getRefreshToken();
            if (!refreshToken) {
                navigation.reset(
                    {
                        index: 0,
                        routes: [{ name: "Welcome" }],
                    }
                )
                return;
            }
            else {
                try {
                    const response = await apiClient.get("/auth/is-logged-in", {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`
                        }
                    });
                    const data = await response.data;
                    if (data.isLoggedIn) {
                        navigation.reset(
                            {
                                index: 0,
                                routes: [{ name: "Home" }],
                            }
                        )
                    } else {
                        navigation.reset(
                            {
                                index: 0,
                                routes: [{ name: "Welcome" }],
                            }
                        )
                    }
                } catch (error) {
                    console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error);
                    navigation.reset(
                        {
                            index: 0,
                            routes: [{ name: "Welcome" }],
                        }
                    )
                }
            }
        }; 
        setTimeout(() => {
            checkLoginStatus();
        }
        , 2000); // Thay đổi thời gian chờ nếu cần
    },[navigation]);
    return (
        <View style={styles.container}> 
            {/* <Image style={styles.image} source={require('../../assets/images/logo.png')} /> */}
            <Text style={styles.text}>OnlyF</Text>
        </View>
    );
}

export default Splash;
