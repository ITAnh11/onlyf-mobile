import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    marginTop: '10%',
  },
  backButton: {
    fontSize: 26,
    color: '#000',
    zIndex: 2,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: -26,
  },
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    padding: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 10,
  },
});

export default styles;