import React, { useCallback, useEffect, useState, useRef, useLayoutEffect } from 'react'
import { View, Text, Dimensions, ActivityIndicator, TouchableOpacity, StyleSheet, TouchableNativeFeedback, RefreshControl } from 'react-native'
import { colors, Header, Button, BottomSheet, Input, Card, Tooltip } from 'react-native-elements'
import { Icon } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'
import { RFValue } from 'react-native-responsive-fontsize'
import { useDispatch, useSelector } from 'react-redux'
import { NoData } from '../../components/atoms'
import { axiosGet, axiosPost } from '../../functions'
import { useToastErrorDispatch } from '../../hooks'

const Kelas = ({ navigation, route }) => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const errorDispatcher = useToastErrorDispatch()
    const [kelas, setKelas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refresh, setRefresh] = useState(false)
    
    const fetchKelas = async () => {
        const { data, status, message } = await axiosGet({ dispatch, route: 'kelas',
            config: {
                headers: {
                    token: user.token
                }
            },
            isToast: false
        })

        if(status == 0){
            errorDispatcher(dispatch, message)
        }
        setKelas(data)
    }

    const TambahKelas = () => {
        return (
            <TouchableOpacity style={{ 
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
            }}
            onPress={() => {
                navigation.navigate('KelasTambah')
            }} 
            >
                <Icon
                    name="plus"
                    size={18}
                    color="white"
                    type="font-awesome-5"
                />
                <Text style={{ 
                    fontFamily: 'Poppins-Regular',
                    color: colors.white,
                    marginLeft: 8
                 }}>Tambah</Text>
            </TouchableOpacity>
        )
    }
    
    const handleRefresh = useCallback(async() => {
        setRefresh(true);
        setIsLoading(true)
        await fetchKelas()
        setIsLoading(false)
        setRefresh(false)
      }, []);

    const CardKelas = ({val}) => {
        return (
            <TouchableNativeFeedback onPress={() => {
                navigation.navigate('KelasDetail', {
                    id_kelas: val.id_kelas
                })
            }}>
                <Card containerStyle={{ 
                    borderRadius: 20
                }}>
                    <View>
                        <Text style={{ 
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: RFValue(16, height),
                            marginBottom: 8
                        }}>{ val.kelas.nama }</Text>
                        <Card.Divider />
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
                                <Text style={{ fontFamily: 'Poppins-Regular', marginLeft: 4 }}>{ val.kelas.kelas_user.length }</Text>
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
                                <Text style={{ fontFamily: 'Poppins-Regular', marginLeft: 4 }}>{ val.kelas.kode_kelas }</Text>
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
                                <Text style={{ fontFamily: 'Poppins-Regular', marginLeft: 4 }}>{ val.kelas.kelas_trail.length }</Text>
                            </View>
                        </View>
                    </View>
                </Card>    
            </TouchableNativeFeedback>
        )
    }

    const firstUpdate = useRef(true);
    useEffect(() => {
        if (firstUpdate.current) {
            (async() => {
                setIsLoading(true)
                await fetchKelas()
                setIsLoading(false)
            })()
            firstUpdate.current = false;
            return;
        }
        
        const unsubscribe = navigation.addListener('focus', () => {
            fetchKelas()
        })

        return unsubscribe
    }, []);

    return (
        <View style={{  flex: 1 }}>
            <Header
                leftComponent={{ text: 'KELAS', style: { 
                    color: '#fff', 
                    fontFamily: 'Poppins-Bold',
                    fontSize: RFValue(18, height),
                }}}
                rightComponent={<TambahKelas />}
            />
            { isLoading ? (
                <View style={{ 
                    flex: 1,
                    justifyContent: 'center'
                }}>
                    <ActivityIndicator style={{ marginTop: 12 }} size="large" color={colors.primary} />
                </View>

            ) : 
                kelas.length > 0 ? (
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                            refreshing={refresh}
                            onRefresh={handleRefresh}
                        />
                      }>
                        {kelas.map(val => 
                            <CardKelas key={`${val.id_kelas}`} val={val} />
                        )}
                    </ScrollView>
                ) : (
                    <ScrollView 
                        refreshControl={
                            <RefreshControl 
                                refreshing={refresh}
                                onRefresh={handleRefresh}
                            />} 
                        style={{ flex: 1 }}
                    >
                        <View style={{ height: height - 120, justifyContent: 'center' }}>
                            <NoData title="Kamu belum punya kelas" subtitle="Tambahkan kelas pada tombol tambah disebelah kanan atas" />
                        </View>
                    </ScrollView>
                )
            }
        </View>
    )
}

const { width, height } = Dimensions.get('window')

export default Kelas

const styles = StyleSheet.create({
    textInput:{
        paddingHorizontal: 10
    },
})