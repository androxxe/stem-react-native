import React, { useState } from 'react'
import { Dimensions, StyleSheet, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Card, Input, Button, Icon, Image, colors } from 'react-native-elements'
import { Formik } from 'formik'
import { logoSingleText } from '../../assets/images'
import * as yup from 'yup'
import Constants from 'expo-constants'
import { useDispatch } from 'react-redux'
import { setIsLogin, setLoadingGlobal, setToken, setUser } from '../../redux'
import { axiosPost } from '../../functions'
import { useToastSuccessDispatch, useToastErrorDispatch } from '../../hooks'
import AutoHeightImage from 'react-native-auto-height-image'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize'
import OneSignal from 'react-native-onesignal'

const index = ({navigation}) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const errorDispatcher = useToastErrorDispatch();
    const validasi = yup.object().shape({
        email: yup.string().required('Email tidak boleh kosong').email('Email tidak valid'),
        password: yup.string().required('Password tidak boleh kosong')
    })

    const handleButtonLogin = async(values) => {
        try {
            setIsLoading(true)
            const { data, status, message } = await axiosPost({dispatch, route: 'login/user', data: values, isToast: false})
            setIsLoading(false)
            if(status == 1){
                dispatch(setUser(data.user))
                dispatch(setToken(data.token))
                dispatch(setIsLogin(true))
                await AsyncStorage.setItem('token', data.token)
                OneSignal.sendTags({
                    id_user: `${data.user.id_user}`,
                })
                navigation.replace('TabStack')
                return false
            } else {
                if(data?.action){
                    if(data.action == 'verif'){
                        setSuccess(message)
                        setError('')
                    }
                    return true
                } else {
                    setError(message)
                    setSuccess('')
                    return false
                }
            }
        } catch (e) {
            errorDispatcher(dispatch, JSON.stringify(e))
        }
    }

const ErrorsAlert = () => {
        if(error){
            return (
                <View style={{ padding: 10, marginHorizontal: 6, marginTop: 20, borderRadius: 10, backgroundColor: colors.error, marginBottom:20 }}>
                    <Text style={{
                        color: 'white',
                        fontFamily: 'Poppins-Regular',
                        fontSize: RFValue(16, height)
                    }}>{ error }</Text>
                </View>
            )
        } else {
            return null;
        }
    }

    const SuccessAlert = () => {
        if(success){
            return (
                <View style={{ padding: 10, marginHorizontal: 6, marginTop: 20, borderRadius: 10, backgroundColor: colors.success, marginBottom:20 }}>
                    <Text style={{
                        color: 'white',
                        fontFamily: 'Poppins-Regular',
                        fontSize: RFValue(16, height)
                    }}>{ success }</Text>
                </View>
            )
        }else{
            return null;
        }
    }
    
    return(
        <View style={styles.container}>
            <ScrollView style={{
                paddingTop: Constants.statusBarHeight,
            }}>
                <Card containerStyle={{ borderRadius: 20 }}>
                    <View style={{ 
                        alignItems: 'center'
                    }}>
                        <AutoHeightImage
                            source={logoSingleText}
                            style={{ marginBottom: 10 }}
                            width={150}
                        />
                    </View>
                    <Text style={{ 
                        textAlign: 'center',
                        fontFamily: 'Poppins-Bold',
                        fontSize: RFValue(20, height),
                        marginTop: 20,
                        marginBottom: 10
                    }}>Login STEM</Text>
                    <ErrorsAlert/>
                    <SuccessAlert />
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        onSubmit={async (values, { resetForm }) => {
                            const status = await handleButtonLogin(values)
                            if(status == true){
                                resetForm()
                            }
                        }}
                        validationSchema={validasi}
                    >
                        {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                            <View>
                                <Input
                                    placeholder="emailkamu@gmail.com"
                                    label="Email"
                                    leftIcon={{ type: 'font-awesome-5', name: 'envelope' }}
                                    style={styles.textInput}
                                    onChangeText={handleChange('email')}
                                    value={values.email}
                                    onBlur={handleBlur('email')}
                                    errorMessage={errors.email && touched.email ? errors.email : ''}
                                />
                                {}
                                <Input
                                    placeholder="Password"
                                    label="Password"
                                    leftIcon={{ type: 'font-awesome-5', name: 'lock' }}
                                    style={styles.textInput}
                                    secureTextEntry={true}
                                    onChangeText={handleChange('password')}
                                    value={values.password}
                                    onBlur={handleBlur('password')}
                                    errorMessage={errors.password && touched.password ? errors.password : ''}
                                />
                                <View style={{ marginVertical:10 }}>
                                    <Button
                                        title="Login"
                                        onPress={handleSubmit}
                                        loading={isLoading}
                                    />
                                </View>
                            </View>
                        )}
                    </Formik>
                    <View style={{ marginVertical: 10, alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={() => navigation.navigate('LupaPassword')}>
                            <Text style={{ color: colors.primary }}>Lupa password?</Text>
                        </TouchableOpacity>
                    </View>
                    <Card.Divider/>
                    <Button
                        buttonStyle={{ marginBottom: 10 }}
                        title="Daftar"
                        type="outline"
                        onPress={() => navigation.navigate('Daftar')}
                    />
                </Card>
                <View style={{ height: 60 }} />
            </ScrollView>
        </View>
    )
}

const { width, height } = Dimensions.get('window')

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    textInput:{
        paddingHorizontal: 10
    }
})

