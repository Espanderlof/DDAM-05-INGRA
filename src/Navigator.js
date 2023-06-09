import { useEffect } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Alert, StyleSheet } from "react-native";

//views
import { HomeView } from "./views/HomeView";
import { ProfileView } from "./views/ProfileView";
import { LoginView } from "./views/LoginView";
import { RegisterView } from "./views/RegisterView";
import { FollowView } from "./views/FollowView";
import { AddPhotoView } from "./views/AddPhotoView";
import { ProfileDetView } from "./views/ProfileDetView";
import { ComentariosView } from "./views/ComentariosView";

//icons
import { Entypo, AntDesign, MaterialIcons } from '@expo/vector-icons';

//redux
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./redux/authSlice";

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

const LogoutTab = ({ navigation }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', (e) => {
            // Muestra un Alert personalizado
            Alert.alert(
                'Cerrar sesión',
                '¿Estás seguro de que quieres cerrar sesión?',
                [
                    {
                        text: 'No',
                        style: 'cancel',
                        onPress: () => {
                            navigation.navigate('Profiles');
                        },
                    },
                    {
                        text: 'Sí',
                        onPress: () => {
                            dispatch(logout());
                        },
                    },
                ],
                { cancelable: false }
            );
        });

        return unsubscribe;
    }, [navigation]);

    return null;
};


const LoginStack = createNativeStackNavigator();
const MyStack = (props) => {
    return (
        
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

const ProfileStack = createNativeStackNavigator();
const StackProfile = (props) => {
    return (
        <ProfileStack.Navigator
            initialRouteName="Profile"
            screenOptions={{
                headerTitle: '',
              }}
        >
            <ProfileStack.Screen
                name="Profile"
                component={ProfileView}
                options={{
                    headerShown: false,
                    transitionSpec: {
                        open: transitionConfig,
                        close: transitionConfig,
                    },
                }}
            />
            <ProfileStack.Screen
                name="Follow"
                component={FollowView}
                options={{
                    //headerShown: false,
                    transitionSpec: {
                        open: transitionConfig,
                        close: transitionConfig,
                    },
                }}
            />
        </ProfileStack.Navigator>
    )
}

const HomeStack = createNativeStackNavigator();
const StackHome = (props) => {
    return (
        <HomeStack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerTitle: '',
              }}
        >
            <HomeStack.Screen
                name="Home"
                component={HomeView}
                options={{
                    headerShown: false,
                    transitionSpec: {
                        open: transitionConfig,
                        close: transitionConfig,
                    },
                }}
            />
            <HomeStack.Screen
                name="ProfileDet"
                component={ProfileDetView}
                options={{
                    //headerShown: false,
                    transitionSpec: {
                        open: transitionConfig,
                        close: transitionConfig,
                    },
                }}
            />
            <HomeStack.Screen
                name="ProfileDetFollow"
                component={FollowView}
                options={{
                    //headerShown: false,
                    transitionSpec: {
                        open: transitionConfig,
                        close: transitionConfig,
                    },
                }}
            />
            <HomeStack.Screen
                name="ComentariosSolo"
                component={ComentariosView}
                options={{
                    //headerShown: false,
                    transitionSpec: {
                        open: transitionConfig,
                        close: transitionConfig,
                    },
                }}
            />
        </HomeStack.Navigator>
    )
}

const Tab = createMaterialBottomTabNavigator();
const MyTabs = () => {
    return (
        <Tab.Navigator
            initialRouteName="HomeView"
            screenOptions={{
                tabBarActiveTintColor: 'purple',
            }}
        >
            <Tab.Screen
                name="HomeView"
                component={StackHome}
                //initialParams={{ listaTareas }}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="home" size={24} color={color} />
                    ),
                    //tabBarBadge: 0,
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Profiles"
                component={StackProfile}
                //initialParams={{ listaTareas }}
                //component={() => <TaskAdd navigation={navigation} />}
                options={{
                    title: "Profile",
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="profile" size={24} color={color} />
                    ),
                    //headerShown: false,
                }}
            />
            <Tab.Screen
                name="AddView"
                component={AddPhotoView}
                //initialParams={{ listaTareas }}
                options={{
                    tabBarLabel: 'Add Photo',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="add-a-photo" size={24} color={color} />
                    ),
                    //tabBarBadge: 0,
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Logout"
                component={LogoutTab}
                options={{
                    tabBarLabel: 'Logout',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="logout" size={24} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

export const Navigator = () => {
    const status = useSelector(state => state.auth.status);    
    console.log(useSelector(state => state.auth));

    return (
        <NavigationContainer>
            {(status != 'authenticated') ? (
                <MyStack />
            ) : (
                <MyTabs />
            )}
        </NavigationContainer>
    )
}

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
