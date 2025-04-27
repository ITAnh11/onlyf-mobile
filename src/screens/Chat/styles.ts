import { StyleSheet } from "react-native";
import Colors from "../../constants/Color";
import { head } from "lodash";

const styles = StyleSheet.create({
  message: {
    flex: 1,
    backgroundColor: Colors.primary_background,
  },
  container: {
    paddingBottom: 30,
    backgroundColor: Colors.primary_background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    backgroundColor: Colors.primary_background,
    marginTop: '10%',
  },
  backButton: {
    fontSize: 26,
    color: Colors.white_button,
    zIndex: 2,
  },
  headerTitle: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
    marginTop: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 30,
    margin: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary_text,
  },
  username: {
    fontSize: 12,
    color: Colors.secondary_text,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },

  //
  messageList: {
    flexGrow: 1,
    padding: 10,
  },
  sms : {
    maxWidth: '75%',
  },
  messageBubble: {
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.secondary_text,
    color: Colors.tertiary_text,
  },
  friendMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.yellow_button,
    color: Colors.primary_text,
  },
  messageText: {
    color: Colors.tertiary_text,
  },
  time: {
    fontSize: 10,
    color: Colors.tertiary_text,
    textAlign: 'right',
    marginTop: 4,
  },
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 20,
    backgroundColor: Colors.primary_background,
    marginBottom: 5,
  },
  iconsButton: {
    marginRight: 10,
  },
  icons: {
    fontSize: 25,
    color: Colors.yellow_button,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: Colors.input_background,
    borderRadius: 20,
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.primary_text,
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  sendButton: {
    padding: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },  
  iconSend: {
    fontSize: 20,
    color: Colors.yellow_button,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 15,
    marginBottom: 10,
  },
});

export default styles;