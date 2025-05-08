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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: Colors.border_avt2,
    marginRight: 20,
  },
  name: {
    fontSize: 17,
    color: Colors.primary_text,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timeAgo: {
    fontSize: 12,
    color: Colors.secondary_text,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.secondary_text,
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
});

export default styles;