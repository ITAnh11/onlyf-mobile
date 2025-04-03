import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    title: {
        fontSize: 26,
        fontFamily: "Roboto",
        marginBottom: 20
    },
    button: {
        width: '15%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333333',
        borderRadius: '50%',
    },
    buttonText: {
        fontSize: 20,
        fontFamily: "Roboto"
    },
    safeArea_style: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#111111',
        
    },
    list_button: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 40,
        marginTop: 20,
    },
    camera_container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});