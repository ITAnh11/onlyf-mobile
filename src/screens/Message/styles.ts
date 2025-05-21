import { StyleSheet } from "react-native";
import Colors from "../../constants/Color";

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
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: -26,
    color: Colors.primary_text,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatarWrapper: {
    width: 60, 
    height: 60,
    borderRadius: 33,
    borderWidth: 3,
    borderColor: Colors.border_avt2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  unreadAvatar: {
    borderColor: Colors.border_avt,
  },
  name: {
    fontSize: 17,
    color: Colors.secondary_text,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  unreadName: {
    color: Colors.primary_text,
  },
  timeAgo: {
    fontSize: 12,
    color: Colors.secondary_text,
  },
  unreadTimeAgo: {
    fontWeight: 'bold',
    color: Colors.primary_text,
  },
  lastMessage: {
    fontSize: 15,
    color: Colors.secondary_text,
  },  
  unreadMessage: {
    color: Colors.primary_text,
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
  ellipse: {
    fontSize: 15,
    color: Colors.border_avt,
    marginLeft: 'auto',
  },
});

export default styles;