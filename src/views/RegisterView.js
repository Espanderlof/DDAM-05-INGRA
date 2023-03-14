import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";


export const RegisterView = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log('btn login');
    };

    const handleSignUp = () => {
        console.log('btn registra');
    };

    return (
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