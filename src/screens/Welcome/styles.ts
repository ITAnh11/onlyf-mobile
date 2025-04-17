import { StyleSheet } from "react-native";
import Colors from "../../constants/Color";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary_background,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 10
    },
    title: {
        fontSize: 26,
        marginBottom: 20,
        color: Colors.primary_text,
    },
    button: {
        width: 200,
        height: 60,
        margin: 10,
        backgroundColor: Colors.yellow_button,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
        borderWidth: 2,
    },
    buttonText: {
        fontSize: 20,
        color: Colors.tertiary_text,
    },
    buttonLoginText: {
        fontSize: 20,
        color: Colors.secondary_text,
        marginTop: 10,
    },
});