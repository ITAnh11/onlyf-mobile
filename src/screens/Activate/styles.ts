import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingTop: '11%',
  },
  backButton: {
    padding: 8,
    fontSize: 26,
    color: "#000",
    zIndex: 2,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: -26,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#5E6A6E",
    padding: 12,
    fontSize: 16,
    marginVertical: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "lightblue",
    paddingVertical: 12,
    paddingHorizontal: 25,
    width: "60%",
    alignItems: "center",
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    marginTop: 30,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontFamily: "Roboto",
  },
  link: {
    color: "#AA5A4A",
    fontSize: 14,
    fontFamily: "Roboto",
    marginTop: 5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    alignSelf: "flex-start",
    marginTop: -3,
    marginBottom: 5,
  },
});

export default styles;