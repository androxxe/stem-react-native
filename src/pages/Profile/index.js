import React, { useState } from 'react'
import { View, Text, Dimensions, Alert, ScrollView } from 'react-native'
import { Header, Icon, ListItem, Avatar, colors } from 'react-native-elements'
import { RFValue } from 'react-native-responsive-fontsize'
import { axiosPost } from '../../functions'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { variable } from '../../utils'
import * as ImagePicker from 'expo-image-picker';
import FormData from 'form-data';
import { setLoadingGlobal, setUser } from '../../redux'

const Profile = ({navigation}) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    
    const handleLogout = async () => {
        try {
            Alert.alert(
                "Apakah kamu yakin?",
                "Klik OK jika kamu yakin untuk logout",
                [
                    { text: "OK", onPress: async () => {
                        const response = await axiosPost({dispatch, route: 'logout', 
                            headers: {
                                token: user.token
                            }
                        })

                        await AsyncStorage.removeItem('token')
                        navigation.replace("Login")
                    }},
                    {
                        text: "Batal",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                ]
            );
        } catch (e) {
            alert(JSON.stringify(e))
        }
    }

    const handleImagePicker = async () => {
        let image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
      
        // console.log(image);
        if (!image.cancelled) {
            const formData = new FormData()
            dispatch(setLoadingGlobal(true))
            formData.append('foto', {
                ...image,
                uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
                name: 'foto',
                type: 'image/jpeg', // it may be necessary in Android. 
            })
            
            const response = await axiosPost({ dispatch, route: 'user/ubah-foto', 
                data: formData,
                headers: {
                    token: user.token
                }
            })
            dispatch(setUser(response.data))
            dispatch(setLoadingGlobal(false))
        }
    }

    const list = [
        {
            title: 'Ubah Profil',
            icon: 'user',
            iconType: 'font-awesome-5',
            onPress: () => navigation.navigate('UbahProfil')
        },
        {
            title: 'Ubah Password',
            icon: 'lock',
            iconType: 'font-awesome-5',
            onPress: () => navigation.navigate('UbahPassword')
        },
        {
            title: 'Logout',
            icon: 'sign-out-alt',
            iconType: 'font-awesome-5',
            onPress: () => handleLogout()
        },
    ]

    return (
        <View style={{  flex: 1 }}>
            <Header
                leftComponent={{ text: 'PROFIL', style: { 
                    color: '#fff', 
                    fontFamily: 'Poppins-Bold',
                    fontSize: RFValue(16, height),
                }}}
                />
            <ScrollView>
                <View style={{ 
                    alignItems: 'center',
                    marginVertical: 20
                }}>
                    <Avatar
                        source={{
                            uri: `${variable.storage}${user.user.foto}`,
                        }}
                        size="xlarge"
                        rounded
                    >
                        <Avatar.Accessory 
                            style={{ 
                                height: 36,
                                width: 36,
                                borderRadius: 36,
                                backgroundColor: colors.primary
                            }} iconStyle={{ 
                                fontSize: 20
                            }}
                            onPress={handleImagePicker}
                        />
                    </Avatar>
                </View>
                {
                    list.map((item, i) => (
                        <ListItem key={i} bottomDivider onPress={item.onPress}> 
                            <Icon
                                name={item.icon}
                                type={item.iconType}    
                            />
                            <ListItem.Content>
                                <ListItem.Title>{item.title}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
                    ))
                }
            </ScrollView>
            <Text style={{ 
                textAlign: 'center',
                color: colors.grey2,
                marginBottom: 20,
                fontSize: 12
            }}>Version 1.0</Text>
        </View>
    )
}

const { width, height } = Dimensions.get('window')
export default Profile
