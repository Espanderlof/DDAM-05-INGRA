import { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, StatusBar, View, ScrollView, Image, RefreshControl, ActivityIndicator, TouchableWithoutFeedback } from "react-native";
import { Card, IconButton, Avatar, Text } from "react-native-paper";
import { getPublicationsWithProfile } from "../services/firebase";
import { useSelector } from "react-redux";


const Post = ({ urlImagen, profile, navigateToProfile }) => {
    //console.log(profile.id);
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
            </Card.Content>
            <Card.Actions style={styles.actions}>
                <IconButton icon="heart-outline" />
                <IconButton icon="comment-outline" />
            </Card.Actions>
        </Card>
    );
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
        }else{
            navigation.navigate('ProfileDet', { profileId });
        }
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
                        <Post key={index} {...dataPublic} navigateToProfile={navigateToProfile} />
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