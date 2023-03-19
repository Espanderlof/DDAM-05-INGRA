import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

//views
import { HomeView } from "./views/HomeView";
import { ProfileView } from "./views/ProfileView";
import { LoginView } from "./views/LoginView";
import { RegisterView } from "./views/RegisterView"; 

//icons
import { Entypo, AntDesign } from '@expo/vector-icons';

//redux
import { useSelector } from "react-redux";

const transitionConfig = {
    // Configura la animación de transición
    animation: 'spring',
    config: {
        stiffness: 500,
        damping: 50,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.02,
        restSpeedThreshold: 0.02,
    },
};

const LoginStack = createNativeStackNavigator();
const MyStack = (props) => {
    return(
        <LoginStack.Navigator
            initialRouteName="Login"
        >
            <LoginStack.Screen
                name="Login"
                component={LoginView}
                options={{
                    headerShown: false,
                    transitionSpec: {
                        open: transitionConfig,
                        close: transitionConfig,
                    },
                }}
            />
            <LoginStack.Screen
                name="Register"
                component={RegisterView}
                options={{
                    headerShown: false,
                    transitionSpec: {
                        open: transitionConfig,
                        close: transitionConfig,
                    },
                }}
            />
        </LoginStack.Navigator>
    )
}

const Tab = createMaterialBottomTabNavigator();
const MyTabs = () => {
    return(
        <Tab.Navigator
            initialRouteName="HomeView"
            screenOptions={{
                tabBarActiveTintColor: 'purple',
            }}
        >
            <Tab.Screen 
                name="HomeView"
                component={HomeView} 
                //initialParams={{ listaTareas }}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size}) => (
                        <Entypo name="home" size={24} color={color} />
                    ),
                    //tabBarBadge: 0,
                    headerShown: false,
                }}
            />
            <Tab.Screen 
                name="Profile"
                component={ProfileView} 
                //initialParams={{ listaTareas }}
                //component={() => <TaskAdd navigation={navigation} />}
                options={{
                    title: "Profile",
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size}) => (
                        <AntDesign name="profile" size={24} color={color} />
                    ),
                    //headerShown: false,
                }}
            />
        </Tab.Navigator>
    )
}



export const Navigator = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    console.log(useSelector(state => state.auth));
    return (
        <NavigationContainer>
            { !isAuthenticated ? (
                <MyStack/>
            ) : (
                <MyTabs/>
            )}
        </NavigationContainer>
    )
}
