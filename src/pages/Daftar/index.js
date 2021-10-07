import React, { Component, useState } from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Constants from 'expo-constants'
import { Card, Image, colors, Button, Input } from 'react-native-elements'
import { Formik } from 'formik'
import * as yup from 'yup'
import { logoSingleText, singleLogo } from '../../assets/images'
import { ScrollView } from 'react-native-gesture-handler'
import { useDispatch } from 'react-redux'
import { useToastErrorDispatch, useToastSuccessDispatch } from '../../hooks'
import { axiosPost } from '../../functions'
import { setLoadingGlobal, setToken, setUser } from '../../redux'

const index = ({ navigation }) => {
    const {errors, setErrors} = useState(null)
    const dispatch = useDispatch()
    const successDispatcher = useToastSuccessDispatch()
    const errorDispatcher = useToastErrorDispatch()
    const validasi = yup.object().shape({
        nama: yup.string().required('Nama tidak boleh kosong'),
        email: yup.string().required('Email tidak boleh kosong').email('Email tidak valid'),
        password: yup.string().required('Password tidak boleh kosong').min(8, 'Password minimal 8 karakter'),
        password_konfirmasi: yup.string().required('Password konfirmasi tidak boleh kosong').oneOf([yup.ref('password')])
    })

    const handleButtonDaftar = async(values) => {
        dispatch(setLoadingGlobal(true))
        const { data, status, message } = await axiosPost({dispatch, route: 'daftar/user', data: values})
        dispatch(setLoadingGlobal(false))
        if(status == 1){
            navigation.navigate('Login')
            successDispatcher(dispatch, message)
        } else {
            setErrors(data)
            errorDispatcher(dispatch, message)
        }
    }

    const ErrorsAlert = () => {
        if(errors){
            return (
                <View>
                    {
                        errors.map((value) => 
                        <View style={{ width: width }}>
                            <Text>{value}</Text>
                        </View>
                        )
                    }
                </View>
            )
        }else{
            return null;
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Card containerStyle={{ 
                    borderRadius: 20,
                    marginBottom: 20
                }}>
                    <Card.Title>DAFTAR STEM</Card.Title>
                    <Card.Divider/>
                    <View style={{ 
                        alignItems: 'center'
                    }}>
                        <Image
                            source={singleLogo}
                            style={{ width: 100, height: 100, marginBottom:10 }}
                        />
                    </View>
                    <ErrorsAlert/>
                    <Formik
                        initialValues={{ email: '', password: '', nama: '', password_konfirmasi: '' }}
                        onSubmit={async(values) => await handleButtonDaftar(values)}
                        validationSchema={validasi}
                    >
                        {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                            <View>
                                <Input
                                    placeholder="Nama Lengkap"
                                    label="Nama"
                                    leftIcon={{ type: 'font-awesome-5', name: 'user' }}
                                    style={styles.textInput}
                                    onChangeText={handleChange('nama')}
                                    value={values.nama}
                                    onBlur={handleBlur('nama')}
                                    errorMessage={errors.nama && touched.nama ? errors.nama : ''}
                                />
                                <Input
                                    placeholder="example@gmail.com"
                                    label="Email"
                                    leftIcon={{ type: 'font-awesome-5', name: 'envelope' }}
                                    style={styles.textInput}
                                    onChangeText={handleChange('email')}
                                    value={values.email}
                                    onBlur={handleBlur('email')}
                                    errorMessage={errors.email && touched.email ? errors.email : ''}
                                />
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
                                <Input
                                    placeholder="Konfirmasi Password"
                                    label="Konfirmasi Password"
                                    leftIcon={{ type: 'font-awesome-5', name: 'lock' }}
                                    style={styles.textInput}
                                    secureTextEntry={true}
                                    onChangeText={handleChange('password_konfirmasi')}
                                    value={values.password_konfirmasi}
                                    onBlur={handleBlur('password_konfirmasi')}
                                    errorMessage={errors.password_konfirmasi && touched.password_konfirmasi ? errors.password_konfirmasi : ''}
                                />
                                <View style={{ marginVertical:10 }}>
                                    <Button
                                        title="Daftar"
                                        onPress={handleSubmit}
                                    />
                                </View>
                            </View>
                        )}
                    </Formik>
                    <View style={{ marginVertical: 10, alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={{ color: colors.primary }}>Sudah punya akun?</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </ScrollView>
        </View>
    )
}
export default index

const {width, height} = Dimensions.get('screen')

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width,
        justifyContent: 'center',
        marginTop: Constants.statusBarHeight,
    },
    textInput: {
        marginHorizontal: 10
    },
})
