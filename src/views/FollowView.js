import { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Avatar, Title, Text, IconButton } from 'react-native-paper';

const FollowItem = ({ item, onDelete }) => {
    return (
        <View style={styles.item}>
            <Avatar.Image source={{ uri: 'https://via.placeholder.com/50x50.png?text=Avatar' }} size={50} />
            <View style={styles.itemText}>
                <Title>{item.name}</Title>
                <Text>{item.username}</Text>
            </View>
            <IconButton
                icon="close"
                size={20}
                onPress={() => onDelete(item)}
            />
        </View>
    );
};

export const FollowView = ({ route }) => {
    //const { title, data } = route.params;
    const [data, setData] = useState(route.params.data);

    const handleDelete = (itemToDelete) => {
        setData(data.filter(item => item !== itemToDelete));
    };

    const renderItem = ({ item }) => (
        <FollowItem
            item={item}
            onDelete={handleDelete}
        />
    );

    return (
        <SafeAreaView style={[stylesSafeArea.container, { marginTop: StatusBar.currentHeight || 0 }]}>
            <View style={styles.container}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
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
});

const stylesSafeArea = StyleSheet.create({
    container: {
        flex: 1,
    },
});