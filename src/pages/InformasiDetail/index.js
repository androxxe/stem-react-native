import React, { useState, useEffect } from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { RFValue } from 'react-native-responsive-fontsize'
import { setLoadingGlobal } from '../../redux'
import { axiosGet, axiosPost } from '../../functions'
import { LeftBackPage, ModalEnableGPS } from '../../components/atoms'
import AutoHeightImage from 'react-native-auto-height-image'
import { variable } from '../../utils'
import { colors, Header, Button, Card, Input } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'
import RenderHtml from 'react-native-render-html';

export default function InformasiDetail({route, navigation}) {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)

    const [informasi, setInformasi] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [komentar, setKomentar] = useState('')

    useEffect(() => {
        fetch()
    }, [])

    const fetch = async () => {
        setIsLoading(true)
        dispatch(setLoadingGlobal(true))
        const response = await axiosGet({dispatch, route: `kelas/detail/${ route.params.id_kelas }/informasi/${route.params.id_informasi}`,
            config : {
                headers: {
                    token: user.token
                }
            },
            isToast: false
        })
        if(response.status == 1){
            setInformasi(response.data)
        } else {
            alert(JSON.stringify(response.message))
        }
        dispatch(setLoadingGlobal(false))
        setIsLoading(false)
    }

    const handleSimpan = async () => {
        if(komentar !== ''){
            setIsLoading(true)
            dispatch(setLoadingGlobal(true))
            const response = await axiosPost({dispatch, route: `kelas/detail/${ route.params.id_kelas }/informasi/${route.params.id_informasi}/simpan`,
                headers: {
                    token: user.token
                },
                data: {
                    komentar: komentar
                }
            })
            await fetch()
            setKomentar('')
            setIsLoading(false)
            dispatch(setLoadingGlobal(false))
        }
    }

    if(isLoading) {
        return null
    } else {
        return (
            <>
                <Header 
                    leftComponent={() => LeftBackPage(navigation)}
                    centerComponent={{
                        text: 'Informasi',
                        style: {
                            fontFamily: 'Poppins-Bold',
                            fontSize: RFValue(18, height),
                            color: colors.white,
                        }
                    }}
                />
                <ScrollView>
                    <View style={{
                        padding: 12,
                        backgroundColor: 'white',
                        paddingBottom: 20
                    }}>
                        <AutoHeightImage style={{ borderRadius: 8 }} width={width - 20} source={{ uri: `${variable.storage}${informasi.thumbnail}`}} />
                        <View style={{ paddingHorizontal: 4 }}>
                            <Text style={{
                                fontSize: RFValue(18, height),
                                fontFamily: 'Poppins-Bold',
                                marginTop: 12
                            }}>{ informasi.judul }</Text>
                            <Text style={{
                                fontFamily: 'Poppins-Regular',
                                color: colors.grey2
                            }}>
                                { informasi.created_at_string }
                            </Text>
                            <View style={{ height: 12 }} />
                            <Card.Divider />
                            <Text style={{
                                fontFamily: 'Poppins-Regular',
                                textAlign: 'justify'
                            }}>
                                <RenderHtml
                                    contentWidth={width}
                                    source={{
                                    html: `<html>
                                        <body style="
                                        -webkit-touch-callout: none;
                                        -webkit-user-select: none;
                                        -khtml-user-select: none;
                                        -moz-user-select: none;
                                        -ms-user-select: none;
                                        user-select: none;
                                        ">
                                            ${informasi.isi}
                                        </body>
                                    </html>`
                                    }}
                                />
                            </Text>
                        </View>
                    </View>
                    <View style={{
                        marginTop: 12,
                        padding: 16,
                        backgroundColor: 'white'
                    }}> 
                        <Text style={{
                            fontFamily: 'Poppins-Bold',
                            marginBottom: 10
                        }}>
                            Komentar
                        </Text>
                        { informasi.komentar.map((val, index) => 
                            <View key={index} style={{ ...styles.cardKomentar,
                                borderTopWidth: index == 0 ? 1 : 0,

                            }}>
                                <AutoHeightImage
                                    width={30}
                                    source={{ uri:`${variable.storage}${val.user.foto}`}}
                                />
                                <View style={{ 
                                    marginLeft: 14,
                                    paddingVertical: 4,
                                }}>
                                    <Text style={{ fontFamily: 'Poppins-SemiBold', marginBottom: 0 }}>{ val.user.nama }</Text>
                                    <Text style={{ marginBottom: 6 }}>{ val.komentar }</Text>
                                    <Text style={{
                                        color: colors.grey3,
                                        marginTop: 4,
                                        fontSize: 12
                                    }}>{ val.created_at_string }</Text>
                                </View>
                            </View>
                        )}
                        <Text style={{
                            fontFamily: 'Poppins-Bold',
                            marginTop: 16
                        }}>
                            Tambah Komentar
                        </Text>
                        <Input
                            placeholder="Isi komentar .."
                            style={styles.textInput}
                            onChangeText={setKomentar}
                            value={komentar}
                        />
                        <View style={styles.buttonRight}>
                            <Button title="Simpan" buttonStyle={{
                                width: 100,
                                height: 36,
                                fontWeight: 400,
                                fontSize: 10
                            }} 
                            titleStyle={{
                                fontSize: 14
                            }}
                            onPress={handleSimpan}
                            />
                        </View>
                    </View>
                </ScrollView>
            </>
        );
    }
}

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
    textInput:{
        paddingHorizontal: 0,
        fontSize: 14,
    },
    buttonRight: {
        display: 'flex',
        alignItems: 'flex-end',
        marginRight: 10,
        marginTop: -10
    },
    cardKomentar: {
        paddingVertical: 6,
        borderColor: colors.grey5,
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        borderLeftWidth: 0,
        borderRightWidth: 0,
        alignItems: 'center'
    }
})