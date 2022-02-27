import React from 'react'
import { View, Dimensions, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Header, Image, Input, colors, Icon, Button, ListItem, Avatar } from 'react-native-elements'
import { RFValue } from 'react-native-responsive-fontsize'
import { LeftBackPage } from '../../components/atoms'
import { Formik } from 'formik'
import * as yup from 'yup'
import { axiosPost } from '../../functions'
import { setIsLogin, setLoadingGlobal, setToken, setUser } from '../../redux'
import { useDispatch, useSelector } from 'react-redux'

const Tambah = ({navigation}) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)

    const handleSubmitForm = async (values) => {
        dispatch(setLoadingGlobal(true))
        const { status, message, data } = await axiosPost({dispatch, route: 'kelompok/tambah',
            headers: {
                token: user.token
            },
            data: values,
        })
        dispatch(setLoadingGlobal(false))
        navigation.goBack()
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white'}}>
            <Header 
                leftComponent={() => LeftBackPage(navigation)}
                centerComponent={{
                    text: 'Tambah Kelompok',
                    style: {
                        fontFamily: 'Poppins-Bold',
                        fontSize: RFValue(18, height),
                        color: colors.white,
                    }
                }}
            />
            <Formik
                initialValues={{ nama: '' }}
                onSubmit={async (values) => await handleSubmitForm(values)}
                validationSchema={yup.object().shape({
                    nama: yup.string().required('Nama anggota harus diisi')
                })}
            >
                {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                    <View style={{
                        padding: 10
                    }}>
                        <Input
                            placeholder="Nama anggota..."
                            label="Nama"
                            leftIcon={{ type: 'font-awesome-5', name: 'user' }}
                            style={styles.textInput}
                            onChangeText={handleChange('nama')}
                            value={values.nama}
                            onBlur={handleBlur('nama')}
                            errorMessage={errors.nama && touched.nama ? errors.nama : ''}
                        />
                        <Button
                            title="Tambah"
                            onPress={handleSubmit}
                        />
                    </View>
                )}
            </Formik>
        </View>
    )
}

const { width, height } = Dimensions.get('window')

export default Tambah

const styles = StyleSheet.create({
    textInput:{
        paddingHorizontal: 10
    }
})
