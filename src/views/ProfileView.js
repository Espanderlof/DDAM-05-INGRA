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
        "seguidores": 0,
        "siguiendo": 0,
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
            const seguidores = profileData.followersData ? profileData.followersData.length : 0;
            const siguiendo = profileData.followingData ? profileData.followingData.length : 0;
            setProfileCounts({
                ...profileCounts,
                "publicaciones": publicaciones,
                "seguidores": seguidores,
                "siguiendo": siguiendo,
            });
            setRefreshing(false);
        } else {
            console.log("No hay un usuario autenticado");
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

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

    const handleFollowPress = (title, oldview, data, user) => {
        navigation.navigate('Follow', {
            title,
            oldview,
            data,
            userId: user.userId,
            userEmail: user.userEmail,
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
                    <TouchableOpacity onPress={() => handleFollowPress('Seguidores', 'Profile', dataUser.followersData, { userId: authUid, userEmail: authEmail })}>
                        <Paragraph style={styles.stat}>
                            <Text style={styles.statNumber}>{profileCounts.seguidores}</Text>
                            {'\n'}
                            <Caption>Seguidores</Caption>
                        </Paragraph>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleFollowPress('Siguiendo', 'Profile', dataUser.followingData, { userId: authUid, userEmail: authEmail })}>
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