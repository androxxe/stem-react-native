import React, { useEffect, useState, useLayoutEffect, useRef } from 'react'
import { Text, StyleSheet, View, Dimensions, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, RefreshControl } from 'react-native'
import { colors, Icon, Header, Input, Avatar } from 'react-native-elements'
import { RFValue } from 'react-native-responsive-fontsize'
import { useDispatch, useSelector } from 'react-redux'
import { axiosGet, requestLocation, hasLocationPermission } from '../../functions'
import { useToastErrorDispatch, useToastSuccessDispatch } from '../../hooks'
import { NoData, CardTrail, ModalEnableGPS } from '../../components/atoms'
import { getDistance } from 'geolib'
import { setIsModalEnableGPS } from '../../redux'

const Favorit = ({navigation}) => {
    const dispatch = useDispatch()
    const [trails, setTrails] = useState([])
    const [formCari, setFormCari] = useState(false)
    const [textCari, setTextCari] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)
    
    const user = useSelector(state => state.user)
    const { location, statusPermission, isGpsOn, isDenied, isLoadingLocation, isModalEnableGPS } = useSelector(state => state.location)
    
    const errorDispatcher = useToastErrorDispatch()
    const successDispatcher = useToastSuccessDispatch()

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchLocation({showModal: true})
        });

        return unsubscribe;
    }, [statusPermission, isGpsOn])

    const firstUpdate = useRef(true);
    useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        fetchLocation({showModal: true})

    }, [statusPermission, isGpsOn]);

    useEffect(() => {
        let timer = 0
        if(isGpsOn == true){
            if(textCari !== ''){
                timer = setTimeout(() => {
                    fetchTrailsCari()
                }, 800)
            } else {
                fetchTrails()
            }
        }

        return () => clearTimeout(timer)
    }, [isGpsOn, textCari])

    const fetchLocation = ({showModal = false}) => {
        if(statusPermission){
            if(isGpsOn){
                requestLocation({dispatch})
                if(showModal && isDenied){
                    dispatch(setIsModalEnableGPS(false))
                }
            } else {
                requestLocation({dispatch})
                if(showModal && isDenied){
                    dispatch(setIsModalEnableGPS(true))
                }
            }
        } else {
            hasLocationPermission({dispatch})
        }
    }

    const fetchTrails = async() => {
        setIsLoading(true)
        const {status, message, data} = await axiosGet({dispatch, route:'trail/favorit',
            config: {
                headers: {
                    token: user.token
                }, 
            }
        , isToast: false})

        if (status != 1) {
            setTrails([])
            errorDispatcher(dispatch, message)
        } else {
            setTrails(data)
        }
        setIsLoading(false)
    }

    const fetchTrailsCari = async () => {
        setIsLoading(true)
        const { status, message, data } = await axiosGet({dispatch, route: 'trail/favorit/cari',
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
        if(isGpsOn){
            let jarak = getDistance(
               { latitude, longitude },
               { latitude: location?.coords.latitude, longitude: location?.coords.longitude })
            return (jarak / 1000).toFixed(2)
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
        if(isLoading || isGpsOn == false){
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
                        renderItem={({item}) => <CardTrail navigation={navigation} item={item} jarak={jarak(item.trail_task[0].task.latitude, item.trail_task[0].task.longitude)}/>}
                        keyExtractor={(item) => `${item.id_trail}`}
                    />
                )
            } else {
                return (
                    <ScrollView 
                        refreshControl={
                            <RefreshControl 
                                refreshing={refresh}
                                onRefresh={handleRefresh}
                            />} 
                        style={{ flex: 1 }}
                    >
                        <View style={{ height: height - 120, justifyContent: 'center' }}>
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
                leftComponent={{
                    text: 'TRAIL FAVORIT', style:{
                        color: colors.white,
                        fontFamily: 'Poppins-Bold',
                        fontSize: RFValue(18, height),
                        width: 400
                    }
                }}
                rightComponent={RightComponent}    
            />
            { formCari ? (
                <View style={{
                    backgroundColor: colors.white,
                    paddingHorizontal: 10,
                    flexDirection: 'row'
                }}>
                    <Input
                        placeholder='Cari Trail'
                        containerStyle={{
                            height: 50,
                            marginTop: 6
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
            <ModalEnableGPS dispatch={dispatch} isModalEnableGPS={isModalEnableGPS} />
        </View>
    )
}

export default Favorit

const {width, height} = Dimensions.get('window')
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
