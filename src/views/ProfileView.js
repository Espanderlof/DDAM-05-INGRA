import { useEffect, useState } from 'react';
import { View, StyleSheet, Image, FlatList, TouchableOpacity, Modal, SafeAreaView, StatusBar, ActivityIndicator, RefreshControl } from 'react-native';
import { Avatar, Title, Text, Caption, Paragraph, Divider, IconButton } from 'react-native-paper';
import { useSelector } from "react-redux";
import { getProfile, getPublicationsByUser } from "../services/firebase";

export const ProfileView = ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [dataUser, setDataUser] = useState(null);
    const [profileCounts, setProfileCounts] = useState({
        "publicaciones": 0,
        "seguidores": 20,
        "siguiendo": 30,
    });
    const [dataPublic, setDataPublic] = useState([]);

    const authEmail = useSelector(state => state.auth.token);
    const authUid = useSelector(state => state.auth.uid);

    const loadProfile = async () => {
        if (authUid != '') {
            const userId = authUid;
            const profileData = await getProfile(userId);
            setDataUser(profileData);
            const publicationsData = await getPublicationsByUser(userId);
            setDataPublic(publicationsData);
            const publicaciones = publicationsData ? publicationsData.length : 0;
            setProfileCounts({
                ...profileCounts,
                "publicaciones": publicaciones
            });
            setRefreshing(false);
        } else {
            console.log("No hay un usuario autenticado");
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const user = {
        name: 'Espanderlof',
        username: '@espanderlof',
        profileImage: 'https://via.placeholder.com/150x150.png?text=Profile',
        posts: 150,
        followers: 300,
        following: 200,
        followersData: [
            { name: 'Jane Smith', username: 'janesmith' },
            // ...más seguidores...
        ],
        followingData: [
            { name: 'Alice Johnson', username: 'alicejohnson' },
            // ...más seguidos...
        ],
        images: [
            // {
            //     url: 'https://via.placeholder.com/150x150.png?text=1',
            //     title: 'Título 1',
            //     description: 'Descripción de la imagen 1',
            // },
            // {
            //     url: 'https://via.placeholder.com/150x150.png?text=2',
            //     title: 'Título 2',
            //     description: 'Descripción de la imagen 2',
            // },
            // {
            //     url: 'https://via.placeholder.com/150x150.png?text=3',
            //     title: 'Título 3',
            //     description: 'Descripción de la imagen 3',
            // },
            // {
            //     url: 'https://via.placeholder.com/150x150.png?text=4',
            //     title: 'Título 4',
            //     description: 'Descripción de la imagen 4',
            // },
            // {
            //     url: 'https://via.placeholder.com/150x150.png?text=5',
            //     title: 'Título 5',
            //     description: 'Descripción de la imagen 5',
            // },
            // {
            //     url: 'https://via.placeholder.com/150x150.png?text=6',
            //     title: 'Título 6',
            //     description: 'Descripción de la imagen 6',
            // },
            // {
            //     url: 'https://via.placeholder.com/150x150.png?text=7',
            //     title: 'Título 7',
            //     description: 'Descripción de la imagen 7',
            // },
            // {
            //     url: 'https://via.placeholder.com/150x150.png?text=8',
            //     title: 'Título 8',
            //     description: 'Descripción de la imagen 8',
            // },
            // {
            //     url: 'https://via.placeholder.com/150x150.png?text=9',
            //     title: 'Título 9',
            //     description: 'Descripción de la imagen 9',
            // },
            // {
            //     url: 'https://via.placeholder.com/150x150.png?text=10',
            //     title: 'Título 10',
            //     description: 'Descripción de la imagen 10',
            // },
            // {
            //     url: 'https://via.placeholder.com/150x150.png?text=11',
            //     title: 'Título 11',
            //     description: 'Descripción de la imagen 11',
            // },
            // {
            //     url: 'https://via.placeholder.com/150x150.png?text=12',
            //     title: 'Título 12',
            //     description: 'Descripción de la imagen 12',
            // },
            // {
            //     url: 'https://via.placeholder.com/150x150.png?text=13',
            //     title: 'Título 13',
            //     description: 'Descripción de la imagen 13',
            // },
            // {
            //     url: 'https://via.placeholder.com/150x150.png?text=14',
            //     title: 'Título 14',
            //     description: 'Descripción de la imagen 14',
            // },
            // {
            //     url: 'https://via.placeholder.com/150x150.png?text=15',
            //     title: 'Título 15',
            //     description: 'Descripción de la imagen 15',
            // },
        ],
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadProfile();
    };

    const handleImagePress = (image) => {
        setSelectedImage(image);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const ImageCard = ({ image, onPress }) => (
        <TouchableOpacity onPress={onPress} style={styles.imageContainer}>
            <Image
                source={{ uri: image.urlImagen }}
                style={styles.image}
            />
        </TouchableOpacity>
    );

    const renderImage = ({ item }) => (
        <ImageCard
            image={item}
            onPress={() => handleImagePress(item)}
        />
    );

    const handleFollowPress = (title, data) => {
        navigation.navigate('Follow', {
            title,
            data,
        });
    };

    const noPublicaciones = () => (
        <View style={styles.noImagesContainer}>
            <Text style={styles.noImagesText}>Sin publicaciones</Text>
        </View>
    );

    if (!dataUser) {
        return (
            <SafeAreaView style={[stylesSafeArea.container, { marginTop: StatusBar.currentHeight || 0 }]}>
                <View style={stylesLoad.container}>
                    <ActivityIndicator size="large" color="#6200ee" />
                    <Text style={stylesLoad.text}>Cargando perfil...</Text>
                </View>
            </SafeAreaView>
        );
    }
    //console.log( dataPublic.length );
    return (
        <SafeAreaView style={[stylesSafeArea.container, { marginTop: StatusBar.currentHeight || 0 }]}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Avatar.Image size={100} source={{ uri: dataUser.profileImage }} />
                    <Title style={styles.title}>{dataUser.name}</Title>
                    <Caption style={styles.caption}>{dataUser.username}</Caption>
                </View>

                <View style={styles.statsContainer}>
                    <TouchableOpacity>
                        <Paragraph style={styles.stat}>
                            <Text style={styles.statNumber}>{profileCounts.publicaciones}</Text>
                            {'\n'}
                            <Caption>Publicaciones</Caption>
                        </Paragraph>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleFollowPress('Seguidores', user.followersData)}>
                        <Paragraph style={styles.stat}>
                            <Text style={styles.statNumber}>{profileCounts.seguidores}</Text>
                            {'\n'}
                            <Caption>Seguidores</Caption>
                        </Paragraph>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleFollowPress('Siguiendo', user.followingData)}>
                        <Paragraph style={styles.stat}>
                            <Text style={styles.statNumber}>{profileCounts.siguiendo}</Text>
                            {'\n'}
                            <Caption>Siguiendo</Caption>
                        </Paragraph>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={dataPublic}
                    renderItem={renderImage}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                    columnWrapperStyle={styles.imageRow}
                    ListEmptyComponent={noPublicaciones}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                        />
                    }
                />

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <SafeAreaView style={styles.modalContainer}>
                        <IconButton
                            icon="close"
                            size={30}
                            color="black"
                            onPress={closeModal}
                            style={styles.closeButton}
                        />
                        {selectedImage && (
                            <>
                                <Image
                                    source={{ uri: selectedImage.urlImagen }}
                                    style={styles.modalImage}
                                />
                                <Title style={styles.modalTitle}>{selectedImage.titulo}</Title>
                                <Caption style={styles.modalDescription}>{selectedImage.descripcion}</Caption>
                            </>
                        )}
                    </SafeAreaView>
                </Modal>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        marginTop: 10,
        fontSize: 24,
    },
    caption: {
        fontSize: 14,
        color: 'gray',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    stat: {
        alignItems: 'center',
        textAlign: 'center'
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    imageRow: {
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    imageContainer: {
        flex: 1,
        margin: 2,
    },
    image: {
        width: '100%',
        height: 100,
        borderRadius: 5,
        aspectRatio: 1,
    },
    modalContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    modalImage: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 10,
        marginBottom: 15,
    },
    noImagesContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    noImagesText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'gray',
    },
});

const stylesSafeArea = StyleSheet.create({
    container: {
        flex: 1,
    },
});

const stylesLoad = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6200ee',
    },
});