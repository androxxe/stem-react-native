import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, View, Dimensions, TouchableOpacity, ScrollView, TouchableNativeFeedback } from 'react-native'
import { Card, colors, Icon, Header, Button, ListItem, Badge, Avatar, Image, Tooltip } from 'react-native-elements'
import { RFValue } from 'react-native-responsive-fontsize'
import { useDispatch, useSelector } from 'react-redux'
import { axiosGet } from '../../functions'
import { useToastErrorDispatch, useToastSuccessDispatch } from '../../hooks'
import { setLoadingGlobal } from '../../redux'
import { variable } from '../../utils'
import { LeftBackPage } from '../../components/atoms'

const KelasDetail = ({navigation, route}) => {
    const dispatch = useDispatch()
    const [kelasDetail, setKelasDetail] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [title, setTitle] = useState('DETAIL KELAS')
    const successDispatcher = useToastSuccessDispatch()
    const errorDispatcher = useToastErrorDispatch()
    
    const user = useSelector(state => state.user)

    const fetchKelasDetail = async () => {
        setIsLoading(true)
        dispatch(setLoadingGlobal(true))
        const { data, status, message } = await axiosGet({ dispatch, route: `kelas/detail/${route.params.id_kelas}`,
            config: {
                headers: {
                    token: user.token
                }
            },
            isToast: false
        })
        
        if(status == 0){
            errorDispatcher(dispatch, message)
            setKelasDetail({})
            return
        }
        setKelasDetail(data)
        dispatch(setLoadingGlobal(false))
        setTitle(data.nama)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchKelasDetail()
    }, [])

    if(isLoading == true){
        return null
    } else {
        return (
            <View style={styles.container}>
                <Header 
                    leftComponent={() => LeftBackPage(navigation)}
                    centerComponent={{
                        text: title,
                        style: {
                            fontFamily: 'Poppins-Bold',
                            fontSize: RFValue(18, height),
                            color: colors.white,
                        }
                    }}
                />
                <ScrollView>
                    <Card containerStyle={{ borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Tooltip popover={<Text>Jumlah peserta</Text>}>
                                    <Icon
                                        name="users"
                                        size={14}
                                        color={colors.primary}
                                        type="font-awesome-5"
                                    />
                                </Tooltip>
                                <Text style={{ fontFamily: 'Poppins-Regular', marginLeft: 4 }}>{ kelasDetail.kelas_user.length }</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Tooltip popover={<Text>Kode kelas</Text>}>
                                    <Icon
                                        name="address-card"
                                        size={14}
                                        color={colors.primary}
                                        type="font-awesome-5"
                                    />
                                </Tooltip>
                                <Text style={{ fontFamily: 'Poppins-Regular', marginLeft: 4 }}>{ kelasDetail.kode_kelas }</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Tooltip popover={<Text>Jumlah rute</Text>}>
                                    <Icon
                                        name="route"
                                        size={14}
                                        color={colors.primary}
                                        type="font-awesome-5"
                                    />
                                </Tooltip>
                                <Text style={{ fontFamily: 'Poppins-Regular', marginLeft: 4 }}>{ kelasDetail.kelas_trail.length }</Text>
                            </View>
                        </View>
                    </Card>
                    <Card containerStyle={{ borderRadius: 10 }}>
                        <View style={styles.containerUser}>
                            <Avatar
                                size="medium"
                                rounded
                                source={{
                                    uri: `${variable.storage}${kelasDetail.user.foto}`,
                                }}
                            />
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ ...styles.title, fontFamily: 'Poppins-SemiBold' }}>Guru</Text>
                                <Text style={styles.title}>{ kelasDetail.user.nama }</Text>
                            </View>
                        </View>
                    </Card>
                    <Card containerStyle={{ borderRadius: 10 }}>
                        <Text style={{ ...styles.title, fontFamily: 'Poppins-Bold' }}>Rute</Text>
                        { kelasDetail.kelas_trail.length > 0 ?
                            kelasDetail.kelas_trail.map((val, index) => 
                                <TouchableOpacity key={`${index}`} onPress={() => navigation.navigate('TrailDetail', {
                                    id_trail: val.trail.id_trail
                                })}>
                                    <ListItem key={index} bottomDivider>
                                        <Avatar title={val.trail.nama} source={{ uri: `${variable.storage}${val.trail.foto}` }} />
                                        <ListItem.Content>
                                            <ListItem.Title style={{ 
                                                fontWeight: 'bold'
                                            }}>{ val.trail.nama }</ListItem.Title>
                                            <ListItem.Subtitle>
                                                { val.trail.keterangan ? val.trail.keterangan.length > 40 ? val.trail.keterangan.substr(0, 40) : val.trail.keterangan : '-' }
                                            </ListItem.Subtitle>
                                        </ListItem.Content>
                                        <ListItem.Chevron />
                                    </ListItem>
                                </TouchableOpacity>
                            ) 
                            : <Text style={{ textAlign: 'center', marginBottom: 8, marginTop: 16 }}>Belum ada rute</Text>                        
                        }
                    </Card>
                    <Card containerStyle={{ borderRadius: 10 }}>
                        <Text style={{ ...styles.title, fontFamily: 'Poppins-Bold' }}>Informasi</Text>
                        { kelasDetail.informasi.length > 0 ?
                            kelasDetail.informasi.map((val, index) => 
                                <TouchableOpacity key={`${index}`} onPress={() => navigation.navigate('InformasiDetail', {
                                    id_informasi: val.id_informasi,
                                    id_kelas: kelasDetail.id_kelas,
                                })}>
                                    <ListItem key={index} bottomDivider>
                                        <Avatar title={val.judul} source={{ uri: `${variable.storage}${val.thumbnail}` }} />
                                        <ListItem.Content>
                                        <ListItem.Title style={{ 
                                            fontWeight: 'bold'
                                        }}>{ val.judul }</ListItem.Title>
                                        <ListItem.Subtitle>
                                            { val.created_at_string }
                                        </ListItem.Subtitle>
                                        </ListItem.Content>
                                    </ListItem>
                                </TouchableOpacity>
                            ) 
                            : <Text style={{ textAlign: 'center', marginBottom: 8, marginTop: 16 }}>Tidak ada informasi</Text>                        
                        }
                    </Card>
                    <Card containerStyle={{ borderRadius: 10, marginBottom: 12 }}>
                        <Text style={{ ...styles.title, fontFamily: 'Poppins-Bold' }}>Daftar Siswa</Text>
                        { kelasDetail.kelas_user.map((val, index) => 
                            <View key={`siswa_${index}`} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginVertical: 6 }}>
                                <Avatar rounded title={val.user.nama} source={{ uri: `${variable.storage}${val.user.foto}` }} />
                                <Text style={{ marginLeft: 8}}>{ val.user.nama }</Text>
                            </View>
                        )}
                    </Card>
                </ScrollView>
                
            </View>
        )
    }

}

export default KelasDetail

const {width, height} = Dimensions.get('window')
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 50,
        width,
        backgroundColor: colors.primary,
    },
    containerUser: { 
        flexDirection: 'row',
    },
    title: {
        fontFamily: 'Poppins-Regular',
        marginLeft: 12,
        fontSize: RFValue(16, height)
    }
})
