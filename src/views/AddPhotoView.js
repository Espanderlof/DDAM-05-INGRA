import { useState } from 'react';
import { View, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useSelector } from "react-redux";
import { createPublication, uploadImageToFirebase } from "../services/firebase";

export const AddPhotoView = () => {
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const authEmail = useSelector(state => state.auth.token);
    const authUid = useSelector(state => state.auth.uid);

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
        try {
            //alert('La funcionalidad del uso de la cámara se encuentra indisponible, ya que se encontró un error en la librería de expo.'); return;
            const permission = await ImagePicker.requestCameraPermissionsAsync();

            if (!permission.granted) {
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
                console.log("foto correcta");
                setImage(result.assets[0]);
            } else {
                console.log("foto cancelada");
                return
            }
        } catch (error) {
            console.log(error);
        }

    };

    const handleSubmit = async () => {
        try {
            // Sube la imagen al storage de Firebase y obtén la URL de la imagen
            const imageUrl = await uploadImageToFirebase(image);

            if (imageUrl) {
                const publicationData = {
                    titulo: title,
                    descripcion: description,
                    publicationDate: new Date(),
                    urlImagen: imageUrl
                };
                await createPublication(authUid, publicationData);

                Alert.alert(
                    '¡Correcto!',
                    'Publicación creada con éxito',
                    [{
                        text: 'Aceptar', onPress: () => {
                            setImage(null);
                            setTitle('');
                            setDescription('');
                        }
                    }]
                );
            } else {
                console.error('Error subiendo la imagen a Firebase');
            }
        } catch (error) {
            console.error("Error al crear la publicación:", error);
        }
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