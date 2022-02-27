import { Formik } from 'formik'
import React, { Component, useState } from 'react'
import { Text, StyleSheet, View, Dimensions } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image'
import { Card, colors, Input, Button } from 'react-native-elements'
import { logoSingleText } from '../../assets/images'
import * as yup from 'yup'
import { RFValue } from 'react-native-responsive-fontsize'
import { axiosPost } from '../../functions'
import { useDispatch } from 'react-redux'
import { useToastErrorDispatch, useToastSuccessDispatch } from '../../hooks'

const index = ({navigation}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [pesan, setPesan] = useState(null)
    const [pesanSukses, setPesanSukses] = useState(false)
    const dispatch = useDispatch()
    const successDispatcher = useToastSuccessDispatch()
    const errorDispatcher = useToastErrorDispatch()

    const handleFormSubmit = async (values) => {
        setIsLoading(true)
        const {status, message, data} = await axiosPost({dispatch, route: 'user/lupa-password', data: values, isToast: false})
        setIsLoading(false)
        if(status == 1){
            setPesanSukses(true)
            setPesan(message)
            return true;
        } else{
            setPesanSukses(false)
            setPesan(message)
            return false
        }
    }
    const validasi = yup.object().shape({
        email: yup.string().required('Email tidak boleh kosong').email('Email tidak valid')
    })

    const PesanKonfirmasi = () => {
        if(pesan){
            return (
                <View style={{ padding: 10, marginHorizontal: 6, marginTop: 20, borderRadius: 10, backgroundColor: pesanSukses ? colors.success : colors.error, marginBottom:20 }} >
                    <Text style={{ color: colors.white, fontFamily: 'Poppins-Regular', fontSize: RFValue(16, height) }}>{pesan}</Text>
                </View>
            )
        }else{
            return null
        }
    }

    return (
        <View style={styles.container}>
            <Card containerStyle={{ borderRadius: 20 }}>
                <Card.Title>LUPA PASSWORD</Card.Title>
                <Card.Divider/>
                <View style={{ alignItems:'center' }}>
                    <AutoHeightImage
                        source={logoSingleText}
                        width={150}
                    />
                </View>
                <PesanKonfirmasi />
                <Formik 
                    initialValues={{email: '',}}
                    validationSchema={validasi}
                    onSubmit={async(values, { resetForm }) => {
                        const status = await handleFormSubmit(values)
                        if(status == true){
                            resetForm()
                        }
                    }}
                >
                    {({handleChange, handleBlur, errors, values, touched, handleSubmit}) => (
                        <View>
                            <Input
                                placeholder="emailkamu@gmail.com"
                                label="Email"
                                leftIcon={{ type: 'font-awesome', name: 'user' }}
                                style={styles.textInput}
                                onChangeText={handleChange('email')}
                                value={values.email}
                                onBlur={handleBlur('email')}
                                errorMessage={errors.email && touched.email ? errors.email : ''}
                            />
                            <View style={{ marginVertical:10 }}>
                                <Button
                                    title="Submit"
                                    onPress={handleSubmit}
                                    loading={isLoading}
                                />
                            </View>
                        </View>
                    )}
                </Formik>
            </Card>
        </View>
    )
}

export default index
const {width, height} = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center'
    },
    textInput: {
        marginHorizontal: 10
    },
})
