import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, View, Dimensions, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, RefreshControl } from 'react-native'
import { Card, colors, Icon, Header, Input, Avatar } from 'react-native-elements'
import { RFValue } from 'react-native-responsive-fontsize'
import { useDispatch, useSelector } from 'react-redux'
import { axiosGet } from '../../functions'
import { useToastErrorDispatch, useToastSuccessDispatch } from '../../hooks'
import { variable } from '../../utils'
import { NoData, CardTrail } from '../../components/atoms'
import * as Location from 'expo-location';
import { getDistance, getPreciseDistance } from 'geolib'

const index = ({navigation}) => {
    const dispatch = useDispatch()
    const [trails, setTrails] = useState([])
    const [formCari, setFormCari] = useState(false)
    const [textCari, setTextCari] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const user = useSelector(state => state.user)
    const successDispatcher = useToastSuccessDispatch()
    const errorDispatcher = useToastErrorDispatch()
    useEffect(() => {
        fetchTrails()
    }, [])

    useEffect(() => {
        (async() => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })()
    }, [])

    if (errorMsg) {
        errorDispatcher(dispatch, 'Terjadi Kesalahan ' + errorMsg)
    } else if (location) {
        successDispatcher(dispatch, "Sukses Mendapatkan Alamat")
    }
    
    useEffect(() => {
        (async() => {
            if(textCari != ''){
                const { status, message, data } = await axiosGet({dispatch, route: 'trail/cari',
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
                }else{
                    setTrails(data)
                }
            }
        })()
    }, [textCari])

    const fetchTrails = async() => {
        setIsLoading(true)
        const {status, message, data} = await axiosGet({dispatch, route:'trail',
            config: {
                headers: {
                    token: user.token
                }, 
            }
        , isToast: false})

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
                                <NoData title="Trail Tidak Tersedia"/>
                            </View>
                    </ScrollView>
                )
            }
        }
    }

    return(
        <View style={styles.container}>
            <Header
                leftComponent={{ text:'TRAILS', style:{
                    color: colors.white,
                    fontFamily: 'Poppins-Bold',
                    fontSize: RFValue(16, height)
                } }}
                centerComponent={{
                    text: 'CARI TRAIL', style:{
                        color: colors.white,
                        fontFamily: 'Poppins-Bold',
                        fontSize: RFValue(16, height)
                    }
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

export default index

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
