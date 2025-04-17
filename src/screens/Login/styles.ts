import { StyleSheet } from "react-native";
import Colors from "../../constants/Color";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary_background,
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
    zIndex: 2,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: -26,
    color: Colors.white_button,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  textInput: {
    fontSize: 16,
    marginBottom: "3%",
    color: Colors.secondary_text,
    paddingLeft: '8%',
  },
  input: {
    width: "90%",
    fontSize: 16,
    alignSelf: "center",
    backgroundColor: Colors.input_background,
    color: Colors.primary_text,
    padding: 12,
    marginBottom: '5%',  
    borderRadius: 25,
  },
  button: {
    backgroundColor: Colors.secondary_background,
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 30,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    marginTop: 30,
  },
  buttonText: {
    color: Colors.tertiary_text,
    fontSize: 20,
  },
  link: {
    color: Colors.link,
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  errorText: {
    color: Colors.error_text,
    fontSize: 12,
    alignSelf: "flex-start",
    marginTop: -3,
    marginBottom: 5,
  },
});
