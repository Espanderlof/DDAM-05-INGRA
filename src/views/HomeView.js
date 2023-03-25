import { StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { Text } from "react-native-paper";

export const HomeView = () => {
    return (
        <SafeAreaView style={[stylesSafeArea.container, { marginTop: StatusBar.currentHeight || 0 }]}>
            <Text>HomeView</Text>
        </SafeAreaView>
    )
}

const stylesSafeArea = StyleSheet.create({
    container: {
        flex: 1,
    },
});