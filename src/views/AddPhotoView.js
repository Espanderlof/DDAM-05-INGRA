import { useState } from 'react';
import { View, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Button, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export const AddPhotoView = () => {
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const requestCameraPermissions = async () => {
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();

        return cameraStatus === 'granted' && mediaLibraryStatus === 'granted';
    };

    const handleChoosePhoto = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (result && !result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const handleTakePhoto = async () => {
        const hasPermissions = await requestCameraPermissions();

        if (!hasPermissions) {
            alert('Se requieren permisos de cámara y galería para tomar fotos.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (result && !result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const handleSubmit = () => {
        // Lógica para guardar la imagen, el título y la descripción en el servidor o almacenamiento local
        console.log('Image:', image);
        console.log('Title:', title);
        console.log('Description:', description);
    };

    return (
        <SafeAreaView style={[stylesSafeArea.container, { marginTop: StatusBar.currentHeight || 0 }]}>
            <View style={styles.container}>
                {image ? (
                    <Image source={{ uri: image.uri }} style={styles.image} />
                ) : (
                    <TouchableOpacity onPress={handleChoosePhoto} style={styles.imagePlaceholder}>
                        <Text style={styles.imagePlaceholderText}>Toque para seleccionar una foto</Text>
                    </TouchableOpacity>
                )}

                <TextInput
                    placeholder="Título"
                    onChangeText={setTitle}
                    value={title}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Descripción"
                    onChangeText={setDescription}
                    value={description}
                    style={styles.input}
                    multiline
                />

                <View style={styles.buttonContainer}>
                    <Button onPress={handleChoosePhoto} mode="contained" style={styles.button}>
                        Seleccionar foto
                    </Button>
                    <Button onPress={handleTakePhoto} mode="contained" style={styles.button}>
                        Tomar foto
                    </Button>
                </View>

                <Button onPress={handleSubmit} mode="contained" disabled={!image || !title || !description}>
                    Add Photo
                </Button>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    imagePlaceholder: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        marginBottom: 20,
    },
    imagePlaceholderText: {
        color: '#9e9e9e',
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        width: '48%',
    },
});


const stylesSafeArea = StyleSheet.create({
    container: {
        flex: 1,
    },
});