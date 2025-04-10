import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 50,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 10
    },
    title: {
        fontSize: 26,
        fontFamily: "Roboto",
        marginBottom: 20
    },
    button: {
        width: 200,
        height: 60,
        margin: 10,
        backgroundColor: "lightblue",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "black"
    },
    buttonText: {
        fontSize: 20,
        fontFamily: "Roboto"
    }
});