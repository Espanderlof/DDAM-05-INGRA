import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
//import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

//views
import { HomeView } from "./views/HomeView";
import { ProfileView } from "./views/ProfileView";

//icons
import { Entypo, AntDesign } from '@expo/vector-icons';


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
    return (
        <NavigationContainer>
            <MyTabs/>
        </NavigationContainer>
    )
}
