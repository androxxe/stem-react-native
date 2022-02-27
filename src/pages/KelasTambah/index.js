import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, Dimensions, ActivityIndicator, TouchableOpacity, StyleSheet, TouchableNativeFeedback, RefreshControl } from 'react-native'
import { colors, Header, Button, BottomSheet, Input, Card, Tooltip } from 'react-native-elements'
import { Icon } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'
import { RFValue } from 'react-native-responsive-fontsize'
import { useDispatch, useSelector } from 'react-redux'
import { LeftBackPage, NoData } from '../../components/atoms'
import { axiosGet, axiosPost } from '../../functions'
import { useToastErrorDispatch } from '../../hooks'
import { setLoadingGlobal } from '../../redux'
import { Formik } from 'formik'
import * as yup from 'yup'

const KelasTambah = ({ navigation, route }) => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    
    const handleSubmitForm = async (values) => {
        dispatch(setLoadingGlobal(true))
        const response = await axiosPost({dispatch, route: 'kelas/masuk', data: {
            kode_kelas: values.kodeKelas
        }, headers: {
            token: user.token
        }})
        dispatch(setLoadingGlobal(false))
        if(response.status == 1){
            navigation.goBack()
        }
    }

    return (
        <View style={{  flex: 1, backgroundColor: 'white' }}>
            <Header 
                leftComponent={() => LeftBackPage(navigation)}
                centerComponent={{
                    text: 'TAMBAH KELAS',
                    style: {
                        fontFamily: 'Poppins-Bold',
                        fontSize: RFValue(18, height),
                        color: colors.white,
                    }
                }}
            />
            <View style={{ 
                padding: 12
            }}>
                <Formik
                    initialValues={{ 
                        kodeKelas: '', 
                    }}
                    onSubmit={async (values) => await handleSubmitForm(values)}
                    validationSchema={yup.object().shape({
                        kodeKelas: yup.string().required('Kode kelas tidak boleh kosong'),
                    })}
                >
                    {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                        <>
                            <Input
                                placeholder="Masukkan kode kelas.."
                                label="Kode Kelas"
                                leftIcon={{ type: 'font-awesome-5', name: 'hashtag' }}
                                style={styles.textInput}
                                onChangeText={handleChange('kodeKelas')}
                                value={values.kodeKelas}
                                onBlur={handleBlur('kodeKelas')}
                                errorMessage={errors.kodeKelas && touched.kodeKelas ? errors.kodeKelas : ''}
                            />
                            <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                                <Button title="Masuk" onPress={handleSubmit} />
                            </View>
                        </>
                    )}
                </Formik>
            </View>
        </View>
    )
}

const { width, height } = Dimensions.get('window')

export default KelasTambah

const styles = StyleSheet.create({
    textInput:{
        paddingHorizontal: 10
    },
})