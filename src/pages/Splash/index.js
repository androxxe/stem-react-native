import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect } from 'react'
import { View, Text, Dimensions, ActivityIndicator } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image'
import { colors } from 'react-native-elements'
import { useDispatch } from 'react-redux'
import { logoSingleText } from '../../assets/images'
import { axiosPost } from '../../functions'
import { useToastErrorDispatch } from '../../hooks'
import { setIsLogin, setToken, setUser } from '../../redux'

const Splash = ({navigation}) => {
    const dispatch = useDispatch()
    const errorDispatcher = useToastErrorDispatch()

    useEffect(() => {
        (async() => {
            const token = await AsyncStorage.getItem('token')
            if(token){
                try {
                    const { data, status, message } = await axiosPost({dispatch, route: 'login/cek-token', headers: {
                        token
                    }, isToast: false})

                    if(status == 1){
                        dispatch(setUser(data.user))
                        dispatch(setToken(data.token))
                        dispatch(setIsLogin(true))
                        await AsyncStorage.setItem('token', data.token)
                        setTimeout(() => {
                            navigation.replace('TabStack')
                        }, 300)
                    } else {
                        setTimeout(() => {
                            navigation.replace('Login')
                        }, 300)
                    }
                } catch (e) {
                    errorDispatcher(dispatch, JSON.stringify(e))
                    alert(JSON.stringify(e))
                    navigation.replace('Login')
                }  
            } else {
                setTimeout(() => {
                    navigation.replace('Login')
                }, 1000)
            }
        })()
    }, [])

    return (
        <View style={{ 
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white'
        }}>
            <AutoHeightImage source={logoSingleText} width={width / 1.5} />
            <ActivityIndicator color={colors.primary} size="large" style={{ 
                marginTop: 30
            }} />
        </View>
    )
}

const { width, height } = Dimensions.get('window')

export default Splash
