import { StyleSheet } from "react-native";
import Colors from "../../constants/Color";

const styles = StyleSheet.create({
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
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: -26,
    color: Colors.primary_text,
  },
  sectionContainer: {
    flex: 1,
    backgroundColor: Colors.primary_background,
  },
  sectionHeader: {
    padding: 5,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary_text,
  },
  searchContainer: {
    padding: 10,
    backgroundColor: Colors.primary_background,
    flexShrink: 1,
  },
});

export default styles;