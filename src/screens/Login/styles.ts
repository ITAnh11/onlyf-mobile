import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff"
    },
    header: {
      padding: 5,
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      paddingHorizontal: 20,
      position: "absolute",
      top: 50,
      left: 0,
    },
    title: {
      fontSize: 24,
      fontFamily: "Roboto",
      marginLeft: "30%"
    },
    body: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingTop: 100,
        paddingBottom: 30
    },
    input: {
      width: "80%",
      borderWidth: 2,
      borderColor: "#5E6A6E",
      padding: 12,
      fontSize: 16,
      marginVertical: 5,
      borderRadius: 10,
      fontFamily: "Roboto",
    },
    footer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        paddingBottom: 30,
    },
    button: {
      backgroundColor: "lightblue",
      paddingVertical: 10,
      paddingHorizontal: 20,
      width: "35%",
      alignItems: "center",
      borderColor: "#000",
      borderWidth: 2,
      borderRadius: 10,
      marginVertical: 10,
      shadowColor: "#000",
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      marginBottom: 10,
      marginTop: 30
    },
    buttonText: {
      color: "#000",
      fontSize: 18,
      fontFamily: "Roboto"
    },
    link: {
      color: "#AA5A4A",
      fontSize: 14,
      fontFamily: "Roboto",
      marginTop: 5
    },
    errorText: {
      color: "red",
      fontSize: 12,
      alignSelf: "flex-start",
      marginLeft: "12%",
      marginRight: "12%",
      marginBottom: 5,
      marginTop: -5,
    },
  });