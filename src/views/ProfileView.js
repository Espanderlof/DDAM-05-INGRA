import { useState } from 'react';
import { View, StyleSheet, Image, FlatList, TouchableOpacity, Modal, SafeAreaView, StatusBar } from 'react-native';
import { Avatar, Title, Text, Caption, Paragraph, Divider, IconButton } from 'react-native-paper';

export const ProfileView = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const user = {
        name: 'Espanderlof',
        username: '@espanderlof',
        profileImage: 'https://akamai.sscdn.co/letras/215x215/fotos/5/c/5/9/5c59c82f7d644c0d5c0c6c1122ba4422.jpg',
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
            'https://via.placeholder.com/150x150.png?text=1',
            'https://via.placeholder.com/150x150.png?text=2',
            'https://via.placeholder.com/150x150.png?text=3',
            'https://via.placeholder.com/150x150.png?text=4',
            'https://via.placeholder.com/150x150.png?text=5',
            'https://via.placeholder.com/150x150.png?text=6',
            'https://via.placeholder.com/150x150.png?text=7',
            'https://via.placeholder.com/150x150.png?text=8',
            'https://via.placeholder.com/150x150.png?text=9',
            'https://via.placeholder.com/150x150.png?text=10',
            'https://via.placeholder.com/150x150.png?text=11',
            'https://via.placeholder.com/150x150.png?text=12',
        ],
        images: [
            {
                url: 'https://via.placeholder.com/150x150.png?text=1',
                title: 'Título 1',
                description: 'Descripción de la imagen 1',
            },
            {
                url: 'https://via.placeholder.com/150x150.png?text=2',
                title: 'Título 2',
                description: 'Descripción de la imagen 2',
            },
            {
                url: 'https://via.placeholder.com/150x150.png?text=3',
                title: 'Título 3',
                description: 'Descripción de la imagen 3',
            },
            {
                url: 'https://via.placeholder.com/150x150.png?text=4',
                title: 'Título 4',
                description: 'Descripción de la imagen 4',
            },
            {
                url: 'https://via.placeholder.com/150x150.png?text=5',
                title: 'Título 5',
                description: 'Descripción de la imagen 5',
            },
            {
                url: 'https://via.placeholder.com/150x150.png?text=6',
                title: 'Título 6',
                description: 'Descripción de la imagen 6',
            },
            {
                url: 'https://via.placeholder.com/150x150.png?text=7',
                title: 'Título 7',
                description: 'Descripción de la imagen 7',
            },
            {
                url: 'https://via.placeholder.com/150x150.png?text=8',
                title: 'Título 8',
                description: 'Descripción de la imagen 8',
            },
            {
                url: 'https://via.placeholder.com/150x150.png?text=9',
                title: 'Título 9',
                description: 'Descripción de la imagen 9',
            },
            {
                url: 'https://via.placeholder.com/150x150.png?text=10',
                title: 'Título 10',
                description: 'Descripción de la imagen 10',
            },
            {
                url: 'https://via.placeholder.com/150x150.png?text=11',
                title: 'Título 11',
                description: 'Descripción de la imagen 11',
            },
            {
                url: 'https://via.placeholder.com/150x150.png?text=12',
                title: 'Título 12',
                description: 'Descripción de la imagen 12',
            },
            {
                url: 'https://via.placeholder.com/150x150.png?text=13',
                title: 'Título 13',
                description: 'Descripción de la imagen 13',
            },
            {
                url: 'https://via.placeholder.com/150x150.png?text=14',
                title: 'Título 14',
                description: 'Descripción de la imagen 14',
            },
            {
                url: 'https://via.placeholder.com/150x150.png?text=15',
                title: 'Título 15',
                description: 'Descripción de la imagen 15',
            },
        ],
    };

    const ImageCard = ({ image, onPress }) => (
        <TouchableOpacity onPress={onPress} style={styles.imageContainer}>
            <Image
                source={{ uri: image.url }}
                style={styles.image}
            />
        </TouchableOpacity>
    );

    const handleImagePress = (image) => {
        setSelectedImage(image);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

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

    return (
        <SafeAreaView style={[stylesSafeArea.container, { marginTop: StatusBar.currentHeight || 0 }]}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Avatar.Image size={100} source={{ uri: user.profileImage }} />
                    <Title style={styles.title}>{user.name}</Title>
                    <Caption style={styles.caption}>{user.username}</Caption>
                </View>

                <View style={styles.statsContainer}>
                    <TouchableOpacity>
                        <Paragraph style={styles.stat}>
                            <Text style={styles.statNumber}>{user.posts}</Text>
                            {'\n'}
                            <Caption>Publicaciones</Caption>
                        </Paragraph>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleFollowPress('Seguidores', user.followersData)}>
                        <Paragraph style={styles.stat}>
                            <Text style={styles.statNumber}>{user.followers}</Text>
                            {'\n'}
                            <Caption>Seguidores</Caption>
                        </Paragraph>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleFollowPress('Siguiendo', user.followingData)}>
                        <Paragraph style={styles.stat}>
                            <Text style={styles.statNumber}>{user.following}</Text>
                            {'\n'}
                            <Caption>Siguiendo</Caption>
                        </Paragraph>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={user.images}
                    renderItem={renderImage}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                    columnWrapperStyle={styles.imageRow}
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
                                    source={{ uri: selectedImage.url }}
                                    style={styles.modalImage}
                                />
                                <Title style={styles.modalTitle}>{selectedImage.title}</Title>
                                <Caption style={styles.modalDescription}>{selectedImage.description}</Caption>
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
});

const stylesSafeArea = StyleSheet.create({
    container: {
        flex: 1,
    },
});