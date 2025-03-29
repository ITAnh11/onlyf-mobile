import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {    
        flex: 1,    
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 26,
        fontFamily: "Roboto",
        marginBottom: 20
    },
    button: {
        backgroundColor: 'lightblue', 
        padding: 10,
        borderRadius: 5,
        borderWidth: 2
    },
    buttonText: {
        fontSize: 20,
        fontFamily: "Roboto"
    }
});