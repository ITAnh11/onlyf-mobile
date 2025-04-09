import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import { styles } from "./styles";
import { NavigationProp } from "@react-navigation/native";
import TokenService from "../../services/token.service";
import apiClient from "../../networking/apiclient";
import setupResponseInterceptor from "../../networking/responseInterceptor";
import setupRequestInterceptor from "../../networking/requestInterceptor";

type Props = {
    navigation: NavigationProp<any>; 
};

const Splash: React.FC<Props> = ({ navigation }) => {
    useEffect(() => {
        setupRequestInterceptor();
        setupResponseInterceptor();
        const checkLoginStatus = async () => {
            const refreshToken = await TokenService.getRefreshToken();
            console.log("Refresh token:", refreshToken);
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
        , 2000);
    },[navigation]);
    return (
        <View style={styles.container}> 
            <Text style={styles.text}>OnlyF</Text>
        </View>
    );
}

export default Splash;
