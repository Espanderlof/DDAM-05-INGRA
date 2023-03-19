import { Provider } from "react-redux";
import { SafeAreaView, StyleSheet, StatusBar } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

import { store } from "./src/redux/store";
import { Navigator } from "./src/Navigator";

export default function App() {
    return (
        <PaperProvider> 
            <SafeAreaView style={[styles.container, { marginTop: StatusBar.currentHeight || 0 }]}>
                <Provider store={ store }> 
                    <Navigator />
                </Provider>
            </SafeAreaView>
        </PaperProvider>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

{/* PaperProvider -> provider de react-native-paper- Permite configurar el tema de la app */}
{/* SafeAreaView de react-native - Se utiliza para asegurarse de que el contenido de la app e renderice dentro de una zona segura de la pantalla del dispositivo */}
{/* Provider  de react-redux - Es un componente de React Redux que proporciona una manera fácil de conectar la aplicación de React a la tienda de Redux */}