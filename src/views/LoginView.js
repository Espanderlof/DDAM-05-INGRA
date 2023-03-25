import { useState } from "react";
import { StyleSheet, View, SafeAreaView, StatusBar } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { auth, loginUser } from "../services/firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LoginView = ({ navigation }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            alert('Todos los campos son requeridos');
            return;
        }
        loginUser(email, password)
            .then((respWS) => {
                const token = respWS._tokenResponse.email;
                const uid = respWS.user.uid;
                AsyncStorage.setItem('token', token);
                AsyncStorage.setItem('uid', uid);
                dispatch(login({ token, uid }));
            })
            .catch((error) => {
                alert(`El usuario o la contraseña son incorrectos: ${error}`);
            });
    };

    const handleSignUp = () => {
        navigation.navigate('Register');
    };

    return (
        <SafeAreaView style={[stylesSafeArea.container, { marginTop: StatusBar.currentHeight || 0 }]}>
            <View style={styles.container}>
                <TextInput
                    label="Correo electrónico"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCompleteType="email"
                    textContentType="emailAddress"
                    style={styles.input}
                />
                <TextInput
                    label="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCompleteType="password"
                    textContentType="password"
                    style={styles.input}
                />
                <Button mode="contained" onPress={handleLogin} style={styles.button}>
                    Iniciar sesión
                </Button>
                <Button mode="outlined" onPress={handleSignUp} style={styles.button}>
                    Registrarme
                </Button>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#DAD8D8',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginBottom: 16,
    },
});
const stylesSafeArea = StyleSheet.create({
    container: {
        flex: 1,
    },
});