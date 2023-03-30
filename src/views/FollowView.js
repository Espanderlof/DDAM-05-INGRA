import { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Avatar, Title, Text, IconButton } from 'react-native-paper';
import { removeFollower, unfollowUser } from '../services/firebase';

export const FollowView = ({ route }) => {
    const { title, oldview, userId, userEmail } = route.params;
    const [data, setData] = useState(route.params.data);
    console.log(title, userId, userEmail, data);

    const handleDelete = async (itemToDelete) => {
        try {
            await unfollowUser(userId, itemToDelete.id, itemToDelete.name);
            await removeFollower(itemToDelete.id, userId, userEmail);

            setData(data.filter(item => item !== itemToDelete));
        } catch (error) {
            console.error('Error: ', error);
            return null;
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Avatar.Image source={{ uri: 'https://via.placeholder.com/50x50.png?text=Avatar' }} size={50} />
            <View style={styles.itemText}>
                <Title>{item.name}</Title>
            </View>
            {title === 'Siguiendo' && oldview === 'Profile' && (
                <IconButton
                    icon="close"
                    size={20}
                    onPress={() => handleDelete(item)}
                />
            )}            
        </View>        
    );

    return (
        <SafeAreaView style={[stylesSafeArea.container, { marginTop: StatusBar.currentHeight || 0 }]}>
            <View style={styles.container}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No tengo información</Text>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    itemText: {
        marginLeft: 15,
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

const stylesSafeArea = StyleSheet.create({
    container: {
        flex: 1,
    },
});