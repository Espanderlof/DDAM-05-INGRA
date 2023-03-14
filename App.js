import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { LoginView } from "./src/views/LoginView";


export default function App() {
    return (
        <PaperProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <LoginView />
            </SafeAreaView>
        </PaperProvider>
    );
}