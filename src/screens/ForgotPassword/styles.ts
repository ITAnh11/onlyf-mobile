import { StyleSheet } from "react-native";
import Colors from "../../constants/Color";

const styles = StyleSheet.create({
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
    color: Colors.primary_text,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: "20%",
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  text: {
    fontSize: 16, 
    marginBottom: 10,
    color: Colors.secondary_text,
    alignSelf: "center",
  },
  inputEmail: {
    width: "80%",
    height: 48,
    fontSize: 16,
    alignSelf: "center",
    alignContent: "center",
    backgroundColor: Colors.input_background,
    color: Colors.primary_text,
    padding: 12,
    marginBottom: '5%',  
    borderRadius: 25,
  },
  button: {
    backgroundColor: Colors.yellow_button,
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignItems: "center",
    borderRadius: 30,
    marginVertical: 10,
    marginTop: 20,
  },
  buttonText: {
    color: Colors.tertiary_text,
    fontSize: 18,
  },
});

export default styles;