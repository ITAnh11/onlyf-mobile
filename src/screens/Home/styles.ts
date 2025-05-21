import { Dimensions, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    title: {
        fontSize: 26,
        fontFamily: "Roboto",
        marginBottom: 20
    },
    button: {
        width: '13%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333333',
        borderRadius: '50%',
    },
    button_friend: {
        flexDirection: "row",
        alignItems:"center",
        backgroundColor: "#333333",
        borderRadius: 30,
    },
    buttonText: {
        fontSize: 20,
        fontFamily: "Roboto",
    },
    safeArea_style: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#111111',
    },
    list_button: {
        position: 'absolute', // Đặt vị trí tuyệt đối
        top: 60, // Khoảng cách từ trên cùng (có thể điều chỉnh)
        left: 0, // Căn trái
        right: 0, // Căn phải
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 0, // Không cần marginBottom khi dùng position: 'absolute'
        marginTop: 0, // Không cần marginTop khi dùng position: 'absolute'
        zIndex: 10, // Đảm bảo nằm trên các thành phần khác
    },
    camera_container: {
        marginTop: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
      overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Nền mờ
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // Đảm bảo nổi trên các thành phần khác
  },

});