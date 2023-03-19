import { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { auth, registerUser } from "../services/firebase";

export const RegisterView = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = () => {
        if (!email || !password || !confirmPassword) {
            alert('Todos los campos son requeridos');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            alert('Por favor, introduzca una dirección de correo electrónico válida');
            return;
        }
        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        registerUser(email, password)
        .then(() =>{
            Alert.alert(
                '¡Correcto!',
                'Usuario registrado con éxito',
                [{ text: 'Aceptar', onPress: () => { navigation.navigate('Login'); } }]
            );
        })
        .catch((error) => {
            alert(`Error al registrar usuario: ${error}`);
        });
    };

    const handleVolver = () => {
        navigation.navigate('Login');
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
                autoCapitalize="none"
                textContentType="password"
                style={styles.input}
            />
            <TextInput
                label="Confirme Contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                textContentType="password"
                style={styles.input}
            />
            <Button mode="contained" onPress={handleRegister} style={styles.button}>
                Registrarme
            </Button>
            <Button mode="outlined" onPress={handleVolver} style={styles.button}>
                Volver
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