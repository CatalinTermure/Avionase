import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'column',
    },
    container2: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    modalView: {
        width: '90%',
        height: '40%',
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'column',
        borderRadius: 15,
        borderColor: '#00000060',
    },
    modalContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: "#00000060",
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: '90%',
        backgroundColor: '#03bdd5',
        alignItems: 'center',
        padding: 10,
        borderRadius: 15,
        borderColor: '#ffffff',
    },
});

export { styles };