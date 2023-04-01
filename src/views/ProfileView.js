import { useEffect, useState } from 'react';
import { View, StyleSheet, Image, FlatList, TouchableOpacity, Modal, SafeAreaView, StatusBar, ActivityIndicator, RefreshControl, TextInput, Alert } from 'react-native';
import { Avatar, Title, Text, Caption, Paragraph, Divider, IconButton } from 'react-native-paper';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { getProfile, getPublicationsByUser, addComment, removeComment, getPublicationById } from '../services/firebase';

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
    const [comentariosPublic, setComentariosPublic] = useState([]);
    const [commentText, setCommentText] = useState('');

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

    const reloadPublication = async (idPublication) => {
        const publicationData = await getPublicationById(idPublication);
        setSelectedImage(publicationData);
        setComentariosPublic(publicationData.comentarios);
        setRefreshing(false);
    }

    const handleRefresh = () => {
        setRefreshing(true);
        loadProfile();
    };
    
    const handleRefreshPublication = () => {
        setRefreshing(true);
        reloadPublication(selectedImage.id);
    };

    const handleImagePress = (image) => {
        reloadPublication(image.id);
        //setSelectedImage(image);
        //setComentariosPublic(image.comentarios);
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

    const NoComments = () => (
        <View style={styles.noCommentsContainer}>
            <Text style={styles.noCommentsText}>No hay comentarios.</Text>
        </View>
    );

    const handleSendComment = async () => {
        if (!commentText) {
            alert('Todos los campos son requeridos');
            return;
        }
        try {
            await addComment(selectedImage.id, commentText, authUid, dataUser.name, authEmail);
            Alert.alert('Comentario enviado...');
            setCommentText('');
            reloadPublication(selectedImage.id);
        } catch (error) {
            Alert.alert('Error al enviar el comentario', error.message);
        }

    };

    const convertTimestampToDate = (timestamp) => {
        const { seconds, nanoseconds } = timestamp;
        const milliseconds = seconds * 1000 + nanoseconds / 1000000;
        return new Date(milliseconds);
    };

    const renderCommentItem = ({ item }) => {
        //console.log(item);
        const isOwnComment = item.idUsuario === authUid;
        const userAvatar = `https://via.placeholder.com/150x150.png?text=${item.NameUsuario}`;
        const dateComentario = convertTimestampToDate(item.fecha);
        return (
            <View style={styles.commentItem}>
                <Avatar.Image source={{ uri: userAvatar }} size={40} />
                <View style={styles.commentContent}>
                    <Text style={styles.commentAuthor}>{item.nameUsuario}</Text>
                    <Text style={styles.commentText}>{item.comentario}</Text>
                    <Text style={styles.commentDate}>{moment(dateComentario).fromNow()}</Text>
                </View>
                {isOwnComment && (
                    <TouchableOpacity onPress={() => handleDeleteComment(item)}>
                        <Avatar.Icon size={24} icon="delete" style={styles.deleteIcon} />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const handleDeleteComment = (item) => {
        Alert.alert(
            'Eliminar comentario',
            '¿Estás seguro de que deseas eliminar tu comentario?',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel delete comentario'),
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    onPress: () => deleteComment(item),
                },
            ],
            { cancelable: false }
        );
    };

    const deleteComment = async (item) => {
        try {
            await removeComment(selectedImage.id, item);
            Alert.alert('Comentario Eliminado...');
            reloadPublication(selectedImage.id);
        } catch (error) {
            Alert.alert('Error al eliminar el comentario', error.message);
        }
    };

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
                        <FlatList
                            data={comentariosPublic}
                            renderItem={renderCommentItem}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={<NoComments />}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={handleRefreshPublication}
                                />
                            }
                        />
                        <View style={styles.commentInputContainer}>
                            <TextInput
                                style={styles.commentInput}
                                onChangeText={text => setCommentText(text)}
                                value={commentText}
                                placeholder="Agrega un comentario..."
                            />
                            <IconButton
                                icon="send"
                                size={24}
                                onPress={handleSendComment}
                                style={styles.sendButton}
                            />
                        </View>
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
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    modalDescription: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
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
    commentItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    commentContent: {
        marginLeft: 10,
        flex: 1,
    },
    commentAuthor: {
        fontWeight: 'bold',
    },
    commentText: {
        fontSize: 14,
        lineHeight: 20,
    },
    commentDate: {
        fontSize: 12,
        color: 'gray',
    },
    deleteIcon: {
        backgroundColor: '#f8f8f8',
        marginLeft: 10,
    },
    noCommentsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    noCommentsText: {
        fontSize: 18,
        fontStyle: 'italic',
        color: 'gray',
    },
    commentInputContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 10,
    },
    commentInput: {
        flex: 1,
        padding: 10,
        fontSize: 16,
    },
    commentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    commentText: {
        fontSize: 16,
        fontWeight: 'bold',
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