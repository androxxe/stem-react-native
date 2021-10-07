import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, View, Dimensions, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, RefreshControl } from 'react-native'
import { Card, colors, Icon, Header, Input, Avatar } from 'react-native-elements'
import { RFValue } from 'react-native-responsive-fontsize'
import { useDispatch, useSelector } from 'react-redux'
import { axiosGet, requestLocation } from '../../functions'
import { useToastErrorDispatch, useToastSuccessDispatch } from '../../hooks'
import { variable } from '../../utils'
import { NoData, CardTrail } from '../../components/atoms'
import { getDistance } from 'geolib'
import { setLoadingGlobal } from '../../redux'

const Index = ({navigation}) => {
    const dispatch = useDispatch()
    const [trails, setTrails] = useState([])
    const [formCari, setFormCari] = useState(false)
    const [textCari, setTextCari] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const user = useSelector(state => state.user)
    const errorDispatcher = useToastErrorDispatch()
    

    const { location, status } = useSelector(state => state.location)

    useEffect(() => {
        (async() => {
            dispatch(setLoadingGlobal(true))
            await requestLocation({dispatch})
            dispatch(setLoadingGlobal(false))
        })()
    }, [])
    
    useEffect(() => {
        let timer = 0
        if(status == true){
            if(textCari !== ''){
                timer = setTimeout(async() => {
                    (async() => {
                        setIsLoading(true)
                        const { status, message, data } = await axiosGet({dispatch, route: 'trail/saya/cari',
                            config:{
                                headers: {
                                    token: user.token
                                },
                                params: {
                                    cari: textCari
                                }
                            }, isToast: false
                        })
                        if (status != 1) {
                            setTrails([])
                            errorDispatcher(dispatch, message)
                        } else {
                            setTrails(data)
                        }
                        alert('test')
                        setIsLoading(false)
                    })()
                }, 800)
            } else {
                fetchTrails()
            }
        } else {
            requestLocation({dispatch})
        }

        return () => clearTimeout(timer)
    }, [status, textCari])

    const fetchTrails = async() => {
        setIsLoading(true)
        const {status, message, data} = await axiosGet({dispatch, route:'trail',
            config: {
                headers: {
                    token: user.token
                }, 
                params: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                }
            }, isToast: false})
        if(status == 1){
            setTrails(data)
        }
        setIsLoading(false)
    }

    const handleButtonCari = () => {
        if(formCari){
            setFormCari(false)
        } else {
            setFormCari(true)
        }
    }

    const jarak = (latitude, longitude) => {
        if(location?.coords.latitude && location?.coords.longitude){
            return getDistance(
               { latitude, longitude },
               { latitude: location?.coords.latitude, longitude: location?.coords.longitude })
        } else {
            return 0
        }
    }

    const RightComponent = () => {
        return (
            <View>
                <TouchableOpacity onPress={handleButtonCari}>
                    <Icon
                        name="search"
                        size={20}
                        color="white"
                        type="font-awesome-5"
                    />
                </TouchableOpacity>
            </View>
        )
    }

    const handleRefresh = async() => {
        setRefresh(true)
        await fetchTrails()
        setFormCari(false)
        setRefresh(false)
    }

    const ListTrails = () => {
        if(isLoading){
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size='large' color={colors.primary}/>
                </View>
            )
        } else {
            if(trails.length > 0){
                return (
                    <FlatList 
                        data={trails}
                        refreshing={refresh}
                        onRefresh={handleRefresh}
                        renderItem={({item}) => <CardTrail navigation={navigation} item={item} jarak={(jarak(item.trail_task[0].task.latitude, item.trail_task[0].task.longitude) / 1000).toFixed(2)}/>}
                        keyExtractor={(item) => `${item.id_trail}`}
                    />
                )
            } else {
                return (
                    <ScrollView refreshControl={
                        <RefreshControl 
                            refreshing={refresh}
                            onRefresh={handleRefresh}
                        />
                    } style={{ flex: 1 }}>
                            <View style={{ marginTop: 100 }}>
                                <NoData title="Trail tidak tersedia"/>
                            </View>
                    </ScrollView>
                )
            }
        }
    }

    return(
        <View style={styles.container}>
            <Header
                // leftComponent={{ text:'TRAILS', style:{
                //     color: colors.white,
                //     fontFamily: 'Poppins-Bold',
                //     fontSize: RFValue(16, height)
                // }}}
                leftComponent={{
                    text: 'CARI TRAIL', style:{
                        color: colors.white,
                        fontFamily: 'Poppins-Bold',
                        fontSize: RFValue(16, height),
                        width: 400
                    },
                    
                }}
                rightComponent={RightComponent}    
            />
            {formCari ? (
                <View style={{
                    backgroundColor: colors.white,
                    paddingHorizontal: 10,
                    flexDirection: 'row'
                }}>
                    <Input
                        placeholder='Cari Trail'
                        containerStyle={{
                            height: 50,
                        }}
                        inputStyle={{
                            fontFamily: 'Poppins-Regular',
                            fontSize: RFValue(16, height)
                        }}
                        onChangeText={value => setTextCari(value)}
                        value={textCari}
                    />
                </View>
            ) : null}
            <ListTrails />
        </View>
    )
}

export default Index

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
    trailTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: RFValue(14, height),
        color: colors.primary
    },
    trailKeterangan: {

    }
})
