import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Login, Daftar, LupaPassword, Profile, Kelas, Trail, TrailDetail, KelasDetail, TrailSaya, TrailMap, TaskQuestion, Splash, UbahProfil, UbahPassword, KelasTambah, TrailFavorit, ImagePanZoom } from '../pages'
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { colors } from 'react-native-elements';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabStack = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
        >
            <Tab.Screen name="Home" component={Home} options={{ 
                tabBarLabel: "Home",
                headerShown:false,
                tabBarIcon: ({ focused, color, size }) => {
                    if(focused){
                        return (<Icon
                            name='home'
                            color={colors.primary}
                            type='feather'
                            />)
                        } else {
                            return (<Icon
                            name='home'
                            color={colors.grey3}
                            type='feather'
                        />)
                    }
                },
            }}/>
            <Tab.Screen name="Kelas" 
                initialParams={{ masukKelas: false }}
                component={Kelas} 
                options={{ 
                    tabBarLabel: "Kelas",
                    headerShown:false,
                    tabBarIcon: ({ focused, color, size }) => {
                        if(focused){
                            return (<Icon
                                name='list-alt'
                                color={colors.primary}
                                type='font-awesome'
                                />)
                            } else {
                                return (<Icon
                                name='list-alt'
                                color={colors.grey3}
                                type='font-awesome'
                            />)
                        }
                    },
                }}/>
            <Tab.Screen name="Trail" component={Trail} options={{ 
                tabBarLabel: "Trail",
                headerShown:false,
                tabBarIcon: ({ focused, color, size }) => {
                    if(focused){
                        return (<Icon
                            name='route'
                            color={colors.primary}
                            type='font-awesome-5'
                            />)
                        } else {
                            return (<Icon
                            name='route'
                            color={colors.grey3}
                            type='font-awesome-5'
                        />)
                    }
                },
            }}/>
            <Tab.Screen name="TrailSaya" component={TrailSaya} options={{ 
                tabBarLabel: "Trail Saya",
                headerShown:false,
                tabBarIcon: ({ focused, color, size }) => {
                    if(focused){
                        return (<Icon
                            name='street-view'
                            color={colors.primary}
                            type='font-awesome-5'
                            />)
                        } else {
                            return (<Icon
                            name='street-view'
                            color={colors.grey3}
                            type='font-awesome-5'
                        />)
                    }
                },
            }}/>
            <Tab.Screen name="Profil" component={Profile} options={{ 
                tabBarLabel: "Profil",
                headerShown:false,
                tabBarIcon: ({ focused, color, size }) => {
                    if(focused){
                        return (<Icon
                            name='user'
                            color={colors.primary}
                            type='feather'
                            />)
                        } else {
                            return (<Icon
                            name='user'
                            color={colors.grey3}
                            type='feather'
                        />)
                    }
                },
            }}/>
        </Tab.Navigator>
    )
}
const MainStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash">
                <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }}/>
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
                <Stack.Screen name="KelasDetail" component={KelasDetail} options={{ headerShown: false }}/>
                <Stack.Screen name="KelasTambah" component={KelasTambah} options={{ headerShown: false }}/>
                <Stack.Screen name="Daftar" component={Daftar} options={{ headerShown: false }}/>
                <Stack.Screen name="TabStack" component={TabStack} options={{ headerShown: false }}/>
                <Stack.Screen name="LupaPassword" component={LupaPassword} options={{ headerShown: false }}/>
                <Stack.Screen name="TrailDetail" component={TrailDetail} options={{ headerShown: false }}/>
                <Stack.Screen name="TrailSaya" component={TrailSaya} options={{ headerShown: false }}/>
                <Stack.Screen name="TrailFavorit" component={TrailFavorit} options={{ headerShown: false }}/>
                <Stack.Screen name="TrailMap" component={TrailMap} options={{ headerShown: false }}/>
                <Stack.Screen name="TaskQuestion" component={TaskQuestion} options={{ headerShown: false }}/>
                <Stack.Screen name="UbahProfil" component={UbahProfil} options={{ headerShown: false }}/>
                <Stack.Screen name="UbahPassword" component={UbahPassword} options={{ headerShown: false }}/>
                <Stack.Screen name="ImagePanZoom" component={ImagePanZoom} options={{ headerShown: false }}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainStack
