import { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, StatusBar, View, ScrollView, Image, RefreshControl, ActivityIndicator, TouchableWithoutFeedback } from "react-native";
import { Card, IconButton, Avatar, Text, Title, Paragraph } from "react-native-paper";
import { getPublicationsWithProfile } from "../services/firebase";
import { useSelector } from "react-redux";
import moment from 'moment';

const Post = ({ id, urlImagen, profile, navigateToProfile, publicationDate, titulo, descripcion, navigateToComentarios }) => {
    //console.log(profile.id);
    const date = convertTimestampToDate(publicationDate);
    const formattedDate = moment(date).fromNow();
    return (
        <Card style={styles.card}>
            <Card.Title
                left={() => (
                    <TouchableWithoutFeedback onPress={() => navigateToProfile(profile.id)}>
                        <Avatar.Image source={{ uri: profile.profileImage }} />
                    </TouchableWithoutFeedback>
                )}
            />
            <Card.Content>
                <Image source={{ uri: urlImagen }} style={styles.image} />
                <Title style={styles.postTitle}>{titulo}</Title>
                <Paragraph style={styles.postDetails}>{descripcion}</Paragraph>
            </Card.Content>
            <Card.Actions style={styles.actions}>
                <IconButton
                    icon="comment-outline"
                    onPress={() => navigateToComentarios(id)}
                />
                <Text style={styles.dateText}>{formattedDate}</Text>
            </Card.Actions>
        </Card>
    );
};

const convertTimestampToDate = (timestamp) => {
    const { seconds, nanoseconds } = timestamp;
    const milliseconds = seconds * 1000 + nanoseconds / 1000000;
    return new Date(milliseconds);
};

export const HomeView = ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(true);
    const [dataPublic, setDataPublic] = useState([]);
    const authUid = useSelector(state => state.auth.uid);

    const loadPublications = async () => {
        const publicationsData = await getPublicationsWithProfile();
        setDataPublic(publicationsData);
        setRefreshing(false);
    };

    const navigateToProfile = (profileId) => {
        if (authUid === profileId) {
            navigation.navigate('Profiles');
        } else {
            navigation.navigate('ProfileDet', { profileId });
        }
    };

    const navigateToComentarios = (publicationId) => {
        //console.log(publicationId)
        navigation.navigate('ComentariosSolo', { publicationId });
    };

    useEffect(() => {
        loadPublications();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        loadPublications();
    };

    if (refreshing) {
        return (
            <SafeAreaView style={[stylesSafeArea.container, { marginTop: StatusBar.currentHeight || 0 }]}>
                <View style={stylesLoad.container}>
                    <ActivityIndicator size="large" color="#6200ee" />
                    <Text style={stylesLoad.text}>Cargando Home...</Text>
                </View>
            </SafeAreaView>
        );
    }
    //console.log(dataPublic);
    return (

        <SafeAreaView style={[stylesSafeArea.container, { marginTop: StatusBar.currentHeight || 0 }]}>
            <View style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={['#42a5f5']}
                        />
                    }
                >
                    {dataPublic.map((dataPublic, index) => (
                        <Post key={index} {...dataPublic} navigateToProfile={navigateToProfile} navigateToComentarios={navigateToComentarios} />
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    card: {
        marginBottom: 8,
    },
    image: {
        height: 300,
        width: '100%',
        resizeMode: 'cover',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    postTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    postDetails: {
        fontSize: 14,
        marginTop: 4,
    },
    dateText: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        fontSize: 12,
        color: '#888',
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