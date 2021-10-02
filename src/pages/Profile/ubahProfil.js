import { Formik } from 'formik'
import React from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native'
import { colors, Header, Input, Button } from 'react-native-elements'
import { RFValue } from 'react-native-responsive-fontsize'
import { LeftBackPage } from '../../components/atoms'
import * as yup from 'yup'
import { axiosPost } from '../../functions'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, setLoadingGlobal } from '../../redux'

const UbahProfil = ({navigation}) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)

    const handleSubmitForm = async (values) => {
        dispatch(setLoadingGlobal(true))
        const response = await axiosPost({dispatch, route: 'user/ubah-profil', 
            data: values,
            headers: {
                token: user.token
            }
        })
        if(response.status == 1){
            dispatch(setUser(response.data))
        }
        dispatch(setLoadingGlobal(false))

        navigation.goBack()
    }

    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <Header 
                leftComponent={() => LeftBackPage(navigation)}
                centerComponent={{
                    text: 'Ubah Profil',
                    style: {
                        fontFamily: 'Poppins-Bold',
                        fontSize: RFValue(16, height),
                        color: colors.white,
                    }
                }}
            />
            <View style={{ padding: 12 }}>
                <Formik
                    initialValues={{ 
                        email: user.user.email, 
                        nama: user.user.nama, 
                    }}
                    onSubmit={async (values) => await handleSubmitForm(values)}
                    validationSchema={yup.object().shape({
                        nama: yup.string().required('Nama tidak boleh kosong'),
                    })}
                >
                    {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                        <View>
                            <Input
                                placeholder="Email"
                                label="Email"
                                disabled
                                leftIcon={{ type: 'font-awesome-5', name: 'envelope' }}
                                style={styles.textInput}
                                onChangeText={handleChange('email')}
                                value={values.email}
                                onBlur={handleBlur('email')}
                                errorMessage='Email tidak dapat diubah'
                                errorStyle={{ color: colors.grey3 }}
                            />
                            <View style={{ height: 10 }} />
                            <Input
                                placeholder="Nama"
                                label="Nama"
                                leftIcon={{ type: 'font-awesome-5', name: 'user' }}
                                style={styles.textInput}
                                onChangeText={handleChange('nama')}
                                value={values.nama}
                                onBlur={handleBlur('nama')}
                                errorMessage={errors.nama && touched.nama ? errors.nama : ''}
                            />
                            <View style={{ marginVertical:10 }}>
                                <Button
                                    title="Simpan"
                                    onPress={handleSubmit}
                                    // loading={isLoading}
                                />
                            </View>
                        </View>
                    )}
                </Formik>
            </View>
        </View>
    )
}

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
    textInput: {
        marginHorizontal: 10
    },
})

export default UbahProfil
