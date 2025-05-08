import { StyleSheet } from "react-native";
import Colors from "../../constants/Color";
import { head } from "lodash";

const styles = StyleSheet.create({
  message: {
    flex: 1,
    backgroundColor: Colors.black_background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    backgroundColor: Colors.black_background,
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
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.myMessage,
  },
  myMessageText: {
    fontSize: 15,
    color: Colors.tertiary_text,
  },
  friendMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.friendMessage,
  },
  friendMessageText: {
    fontSize: 15,
    color: Colors.primary_text,
  },
  time: {
    fontSize: 10,
    color: Colors.secondary_text,
    textAlign: 'center',
    margin: 5,

  },
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 20,
    backgroundColor: Colors.black_background,
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
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  video: {
    width: '60%',
    height: undefined,
    aspectRatio: 1,
  },
  newMessageAlert: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: Colors.newMessage,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: 1,
  },
  newMessageText: {
    color: Colors.primary_text,
    fontWeight: 'bold',
  },  
});

export default styles;