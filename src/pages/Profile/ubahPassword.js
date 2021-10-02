import { Formik } from 'formik'
import React from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native'
import { colors, Header, Input, Button } from 'react-native-elements'
import { RFValue } from 'react-native-responsive-fontsize'
import { LeftBackPage } from '../../components/atoms'
import * as yup from 'yup'
import { axiosPost } from '../../functions'
import { useDispatch, useSelector } from 'react-redux'
import { setLoadingGlobal } from '../../redux'

const UbahPassword = ({navigation}) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)

    const handleSubmitForm = async (values) => {
        dispatch(setLoadingGlobal(true))
        const response = await axiosPost({dispatch, route: 'user/ubah-password', 
            data: values,
            headers: {
                token: user.token
            }
        })
        dispatch(setLoadingGlobal(false))

        navigation.goBack()
    }

    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <Header 
                leftComponent={() => LeftBackPage(navigation)}
                centerComponent={{
                    text: 'Ubah Password',
                    style: {
                        fontFamily: 'Poppins-Bold',
                        fontSize: RFValue(16, height),
                        color: colors.white,
                    }
                }}
            />
            <View style={{ padding: 12 }}>
                <Formik
                    initialValues={{ password_lama: '', password_baru: '', konfirmasi_password_baru: '' }}
                    onSubmit={async (values) => await handleSubmitForm(values)}
                    validationSchema={yup.object().shape({
                        password_lama: yup.string().required('Password tidak boleh kosong').min(8, 'Password minimal 8 karakter'),
                        password_baru: yup.string().required('Password tidak boleh kosong').min(8, 'Password minimal 8 karakter'),
                        konfirmasi_password_baru: yup.string().required('Password tidak boleh kosong').min(8, 'Password minimal 8 karakter').oneOf([yup.ref('password_baru')], 'Konfirmasi password baru harusa sama dengan password baru'),
                    })}
                >
                    {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                        <View>
                            <Input
                                placeholder="Password lama"
                                label="Password lama"
                                leftIcon={{ type: 'font-awesome-5', name: 'lock' }}
                                style={styles.textInput}
                                secureTextEntry={true}
                                onChangeText={handleChange('password_lama')}
                                value={values.password_lama}
                                onBlur={handleBlur('password_lama')}
                                errorMessage={errors.password_lama && touched.password_lama ? errors.password_lama : ''}
                            />
                            <Input
                                placeholder="Password baru"
                                label="Password baru"
                                leftIcon={{ type: 'font-awesome-5', name: 'lock' }}
                                style={styles.textInput}
                                secureTextEntry={true}
                                onChangeText={handleChange('password_baru')}
                                value={values.password_baru}
                                onBlur={handleBlur('password_baru')}
                                errorMessage={errors.password_baru && touched.password_baru ? errors.password_baru : ''}
                            />
                            <Input
                                placeholder="Konfirmasi password baru"
                                label="Konfirmasi password baru"
                                leftIcon={{ type: 'font-awesome-5', name: 'lock' }}
                                style={styles.textInput}
                                secureTextEntry={true}
                                onChangeText={handleChange('konfirmasi_password_baru')}
                                value={values.konfirmasi_password_baru}
                                onBlur={handleBlur('konfirmasi_password_baru')}
                                errorMessage={errors.konfirmasi_password_baru && touched.konfirmasi_password_baru ? errors.konfirmasi_password_baru : ''}
                            />
                            <View style={{ marginVertical:10 }}>
                                <Button
                                    title="Ubah Password"
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

export default UbahPassword
