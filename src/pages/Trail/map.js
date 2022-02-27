import React, { useEffect, useState, useLayoutEffect, useRef } from 'react'
import { View, Text, Dimensions, StyleSheet, Modal, Pressable, ActivityIndicator, Alert, Linking, Animated } from 'react-native'
import { colors, Header, SpeedDial, ListItem, BottomSheet, Button, Avatar, Icon, Card } from 'react-native-elements'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { RFValue } from 'react-native-responsive-fontsize'
import { LeftBackPage, ModalEnableGPS } from '../../components/atoms'
import { axiosGet, axiosPost, requestLocation, hasLocationPermission } from '../../functions'
import { useDispatch, useSelector } from 'react-redux'
import { getCenter } from 'geolib'
import { variable } from '../../utils'
import { useToastErrorDispatch } from '../../hooks'
import { LateTime, MarkerGreen, MarkerOrange, OnTime, UserOnMaps as UserOnMapsIcon, FinishGreen, FinishOrange, StartGreen, StartOrange } from '../../assets/images'
import { setLoadingGlobal, setIsModalEnableGPS } from '../../redux'
import AutoHeightImage from 'react-native-auto-height-image'

const SpeedDialComponent = ({ setIsSpeedDialOpen, isSpeedDialOpen, showModalTask, setShowModalTask, fetchPengerjaanTrail}) => {
    return (
        <SpeedDial
            isOpen={isSpeedDialOpen}
            icon={{ name: 'ellipsis-v', color: '#fff', type: 'font-awesome-5' }}
            openIcon={{ name: 'close', color: '#fff' }}
            onOpen={() => setIsSpeedDialOpen(!isSpeedDialOpen)}
            onClose={() => setIsSpeedDialOpen(!isSpeedDialOpen)}
            size="small"
            color={colors.primary}
        >
            <SpeedDial.Action
                icon={{ name: 'flag', color: '#fff', type: 'leather' }}
                onPress={() => setShowModalTask(!showModalTask)}
                color={colors.primary}
                />
            <SpeedDial.Action
                icon={{ name: 'redo', color: '#fff', type: 'font-awesome-5' }}
                onPress={() => {
                    fetchPengerjaanTrail()
                    setIsSpeedDialOpen(!isSpeedDialOpen)
                }}
                color={colors.primary}
            />
        </SpeedDial>
    )
}
const map = ({ navigation, route}) => {
    const dispatch = useDispatch()
    const [trail, setTrail] = useState({})
    const [title, setTitle] = useState('Task')
    const [isLoading, setIsLoading] = useState(true)
    const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false)
    const [isVisibleBottomSheetTask, setIsVisibleBottomSheetTask] = useState(false)
    const [isVisibleModalKumpulkan, setIsVisibleModalKumpulkan] = useState(false)
    const [dataModalKumpulkan, setDataModalKumpulkan] = useState({})
    const [jumlahTaskDikerjakan, setJumlahTaskDikerjakan] = useState(0)
    const [center, setCenter] = useState(false)
    const [showModalTask, setShowModalTask] = useState(false)
    const [dataBottomSheetMask, setDataBottomSheetMask] = useState(false)
    const [userOnMaps, setUserOnMaps] = useState([])
    
    const { location, statusPermission, isGpsOn, isDenied, isLoadingLocation, isModalEnableGPS } = useSelector(state => state.location)
    const user = useSelector(state => state.user)
    const errorDispatcher = useToastErrorDispatch()

    let totalTask = 0
    if(Object.keys(trail).length > 0){
        totalTask = trail?.trail_task.length
    }
    
    // 
    useEffect(() => {
        setShowModalTask(route.params.showModalTask)
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
        const unsubscribe = navigation.addListener('focus', () => {
            if(isGpsOn == true){
                fetchPengerjaanTrail()
            }
        })

        return unsubscribe
    }, [isGpsOn])

    useEffect(() => {
        if(Object.keys(trail).length > 0){
            if(isGpsOn == true){
                loopCurrentLocation()
            }

            setCenter(getCenter(trail.trail_task.map(val => {
                return {
                    latitude: val.task.latitude,
                    longitude: val.task.longitude,
                }
            })))

            let tempJumlah = 0
            trail.trail_task.map(val => {
                if(val.task.task_answer.length > 0){
                    tempJumlah++
                }
            })
            setJumlahTaskDikerjakan(tempJumlah)
        }
    }, [isGpsOn, trail, showModalTask])

    const loopCurrentLocation = async () => {
        if(navigation.isFocused()){
            if(isGpsOn && Object.keys(trail).length > 0){
                await fetchCurrentLocation()
                await saveCurrentLocation()
            }
            setTimeout(async function() {   
                await loopCurrentLocation()
            }, 10000)
        }
    }

    const fetchCurrentLocation = async () => {
        const response = await axiosGet({dispatch, route: 'trail/current-location',
            config: {
                headers: {
                    token: user.token
                },
                params: {
                    id_trail_user: trail.trail_user[0].id_trail_user,
                }, 
            },
            isToast: false
        })

        if(response.status == 0){
            errorDispatcher(dispatch, 'Gagal menyimpan data lokasi')
            return
        }
        
        if(response.data){
            if(!showModalTask){
                setUserOnMaps(response.data)
            }
        }
    }

    const saveCurrentLocation = async () => {
        const response = await axiosPost({dispatch, route: 'trail/current-location/simpan',
            headers: {
                token: user.token
            },
            data: {
                id_trail_user: trail.trail_user[0].id_trail_user,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            }, 
            isToast: false
        })

        if(response.status == 0){
            errorDispatcher(dispatch, response.message ? response.message : 'Gagal menyimpan data lokasi')
        }
    }

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

    const fetchPengerjaanTrail = async () => {
        setIsLoading(true)
        const response = await axiosGet({dispatch, route: `trail/detail/${route.params.id_trail}/pengerjaan`,
            config: {
                headers: {
                    token: user.token
                }
            },
            isToast: false
        })
        
        if(response.status == 0){
            errorDispatcher(dispatch, response.message)
            return
        }
        
        setTrail(response.data)
        setTitle(response.data.nama)
        setIsLoading(false)
    }

    const handleClickMarker = (val) => {
        setIsVisibleBottomSheetTask(true)
        setDataBottomSheetMask(val)
    }

    const handleTutupBottomSheet = () => {
        setIsVisibleBottomSheetTask(false)
        setDataBottomSheetMask(null)
    }

    const handleMenujuTugas = (val) => {
        if(trail.is_sequence == 1){
            // alert(JSON.stringify(val.sequence))
            if(val.sequence == 1){
                navigation.navigate('TaskQuestion', {
                    trail_task: val,
                    id_trail_user: trail.trail_user[0].id_trail_user
                })
                setIsVisibleBottomSheetTask(false)
                return
            }
            let sudah_dikerjakan = []
            trail.trail_task.map(val => {
                if(val.task.task_answer.length > 0){
                    sudah_dikerjakan.push(val)
                }
            })
            
            let is_boleh_mengerjakan = true
            sudah_dikerjakan.map((val, index) => {
                if(val.sequence != (index + 1)){
                    is_boleh_mengerjakan = false
                }
            })
            
            if(is_boleh_mengerjakan){
                if(sudah_dikerjakan.length > 0){
                    if(val.sequence <= (sudah_dikerjakan[(sudah_dikerjakan.length - 1)].sequence + 1)){
                        navigation.navigate('TaskQuestion', {
                            trail_task: val,
                            id_trail_user: trail.trail_user[0].id_trail_user
                        })
                        setIsVisibleBottomSheetTask(false)
                        return
                    } else {
                        Alert.alert(`Kerjakan rute secara berurut`, 
                            "Pengerjaan tugas pada rute ini harus dikerjakan secara berurutan")
                    }
                } else {
                    if(val.sequence == 1){
                        navigation.navigate('TaskQuestion', {
                            trail_task: val,
                            id_trail_user: trail.trail_user[0].id_trail_user
                        })
                        setIsVisibleBottomSheetTask(false)
                    } else {
                        Alert.alert("Kerjakan rute secara berurut", 
                            "Pengerjaan tugas pada rute ini harus dikerjakan secara berurutan")
                    }
                }
            } else {
                Alert.alert("Kerjakan rute secara berurut", 
                    "Pengerjaan tugas pada rute ini harus dikerjakan secara berurutan")
            }
        } else {
            navigation.navigate('TaskQuestion', {
                trail_task: val,
                id_trail_user: trail.trail_user[0].id_trail_user
            })
            setIsVisibleBottomSheetTask(false)
            return
        }
    }

    const handleKumpulkan = async () => {
        dispatch(setLoadingGlobal(true))
        const response = await axiosPost({dispatch, route: 'trail/kumpulkan', data: {
            id_trail_user: trail.trail_user[0].id_trail_user
        }, headers: {
            token: user.token
        }})
        if(response.status == 1){
            setIsVisibleModalKumpulkan(true)
            if(response.data.status_telat == 1){
                setDataModalKumpulkan({
                    statusTelat: 1,
                    message: response.data.message
                })
            } else {
                setDataModalKumpulkan({
                    statusTelat: 0,
                    message: response.data.message
                })
            }
        }
        await fetchPengerjaanTrail()
        dispatch(setLoadingGlobal(false))
    }

    const ModalListTask = () => {
        if(showModalTask){

            return <View style={{
                position: 'absolute',
                width,
                height,
                left: 0,
                top: 0,
                backgroundColor: 'rgba(40, 40, 40, 0.4)'
            }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ width: '100%', paddingHorizontal: 16}}>
                            <Text style={{ fontSize: RFValue(16, height), fontFamily: 'Poppins-Bold', paddingTop: 20, marginBottom: 14, color: colors.primary }}>
                                { trail.nama }
                            </Text>
                        </View>
                        { trail.trail_task.map((val, index) => 
                            <ListItem key={index} bottomDivider style={{ width: '100%' }}>
                                <ListItem.Content>
                                    <ListItem.Title>
                                        #{ val.sequence } { val.task.judul }
                                    </ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        )}
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                setShowModalTask(!showModalTask)
                                setIsSpeedDialOpen(false)
                            }}>
                            <Text style={styles.textStyle}>Tutup</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        } else {
            return null
        }
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={showModalTask}
                onRequestClose={() => {
                    setShowModalTask(!showModalTask);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ width: '100%', paddingHorizontal: 16}}>
                            <Text style={{ fontSize: RFValue(16, height), fontFamily: 'Poppins-Bold', paddingTop: 20, marginBottom: 14, color: colors.primary }}>
                                { trail.nama }
                            </Text>
                        </View>
                        { trail.trail_task.map((val, index) => 
                            <ListItem key={index} bottomDivider style={{ width: '100%' }}>
                                <ListItem.Content>
                                    <ListItem.Title>
                                        #{ val.sequence } { val.task.judul }
                                    </ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        )}
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                setShowModalTask(!showModalTask)
                                setIsSpeedDialOpen(false)
                            }}>
                            <Text style={styles.textStyle}>Tutup</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        )
    } 

    if(isLoading){
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    }

    if(Object.keys(trail).length > 0 && isGpsOn){
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
                { isLoading || !center ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                    <MapView
                        style={{ 
                            flex: 1
                        }}
                        initialRegion={{
                            latitude: center.latitude,
                            longitude: center.longitude,
                            latitudeDelta: 0.09,
                            longitudeDelta: 0.09,
                        }}
                        showsUserLocation={true}
                        followUserLocation={true}
                    >   
                        { trail.is_sequence == 1 ?
                            <Polyline
                                coordinates={trail.trail_task.map(val => {
                                    return {
                                        latitude: val.task.latitude,
                                        longitude: val.task.longitude,
                                    }
                                })}
                                strokeColor={colors.primary}
                                strokeWidth={3}
                                lineDashPattern={[10]}
                            />
                        : null }
                        { userOnMaps.length > 0 ? 
                            userOnMaps?.map((val, index) => (
                                <Marker 
                                    key={`userOnMaps_${index}`}
                                    coordinate={{
                                        latitude: parseFloat(val.trail_user_current_location_first.latitude),
                                        longitude: parseFloat(val.trail_user_current_location_first.longitude),
                                    }}
                                >
                                    <AutoHeightImage source={UserOnMapsIcon} width={20} />
                                </Marker>
                            )) : null
                        }
                        { trail.is_sequence == 1 ?
                            trail.trail_task.map((val, index) => (
                                val.sequence != 1 && val.sequence != totalTask ?
                                    <Marker
                                        key={`trailTask_${index}`}
                                        coordinate={{ 
                                            latitude: parseFloat(val.task.latitude),
                                            longitude: parseFloat(val.task.longitude),
                                        }}
                                        title={`#${val.sequence} ${val.task.judul}`}
                                        onPress={() => handleClickMarker(val)}
                                    >
                                        <AutoHeightImage source={val.task.task_answer.length > 0 ? MarkerGreen : MarkerOrange} width={20} />
                                    </Marker>
                                : null
                            ))
                        : trail.trail_task.map((val, index) => (
                                <Marker
                                    key={`trailTask_${index}`}
                                    coordinate={{ 
                                        latitude: parseFloat(val.task.latitude),
                                        longitude: parseFloat(val.task.longitude),
                                    }}
                                    title={`#${val.sequence} ${val.task.judul}`}
                                    onPress={() => handleClickMarker(val)}
                                >
                                    <AutoHeightImage source={val.task.task_answer.length > 0 ? MarkerGreen : MarkerOrange} width={20} />
                                </Marker>
                        )) }
                        { trail.is_sequence == 1 ?
                            trail.trail_task.map((val, index) => (
                                val.sequence == 1 ?
                                    <Marker
                                        key={`trailTask_${index}`}
                                        coordinate={{ 
                                            latitude: parseFloat(val.task.latitude),
                                            longitude: parseFloat(val.task.longitude),
                                        }}
                                        title={`#${val.sequence} ${val.task.judul}`}
                                        onPress={() => handleClickMarker(val)}
                                    >
                                        <AutoHeightImage style={{
                                        }} source={val.task.task_answer.length > 0 ? StartGreen : StartOrange } width={34} />
                                    </Marker>
                                : null
                            ))
                        : null }
                        { trail.is_sequence == 1 ?
                            trail.trail_task.map((val, index) => (
                                val.sequence == totalTask ?
                                    <Marker
                                        key={`trailTask_${index}`}
                                        coordinate={{ 
                                            latitude: parseFloat(val.task.latitude),
                                            longitude: parseFloat(val.task.longitude),
                                        }}
                                        title={`#${val.sequence} ${val.task.judul}`}
                                        onPress={() => handleClickMarker(val)}
                                    >
                                        <AutoHeightImage style={{
                                        }} source={val.task.task_answer.length > 0 ? FinishGreen : FinishOrange } width={34} />
                                    </Marker>
                                : null
                            ))
                        :null }
                    </MapView>
                )}
                <ModalListTask />
                <BottomSheet
                    isVisible={isVisibleBottomSheetTask}
                    containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
                >
                    { dataBottomSheetMask ?
                        <View style={{ backgroundColor: 'white', padding: 20 }}>
                            <View style={{
                                alignItems: 'flex-end',
                                marginTop: -10
                            }}>
                                <Button 
                                    onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${dataBottomSheetMask.task.latitude},${dataBottomSheetMask.task.longitude}`)} 
                                    buttonStyle={{ marginBottom: 10, backgroundColor: colors.success, width: 'auto' }} 
                                    title="Google Maps" 
                                    titleStyle={{
                                        fontSize: RFValue(12, height)
                                    }}
                                    icon={
                                        <Icon
                                            containerStyle={{
                                                marginRight: 8
                                            }}
                                            name="map-marker-alt"
                                            size={15}
                                            color="white"
                                            type="font-awesome-5"
                                        />
                                    }
                                    />
                            </View>
                            <Card.Divider />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Avatar
                                    size="medium"
                                    rounded
                                    containerStyle={{ borderWidth: 1, borderColor: colors.grey2 }}
                                    source={{
                                        uri: `${variable.storage}${dataBottomSheetMask.task.foto}`,
                                    }}
                                />
                                <Text style={{ 
                                    fontWeight: 'bold',
                                    fontSize: RFValue(16, height),
                                    marginLeft: 10
                                }}>#{ dataBottomSheetMask.sequence } { dataBottomSheetMask.task.judul }</Text>
                            </View>
                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Button onPress={handleTutupBottomSheet} title="Tutup" buttonStyle={{ backgroundColor: colors.grey3, marginRight: 10 }} style={{ width: 200 }} />
                                <Button onPress={() => handleMenujuTugas(dataBottomSheetMask)} title="Kerjakan" style={{ width: 200 }} />
                            </View>
                        </View>
                    : null }
                </BottomSheet>
                { trail.trail_user[0].status == 0 ?
                    trail.trail_task.length == jumlahTaskDikerjakan ?
                        <Button onPress={handleKumpulkan} title="Kumpulkan" buttonStyle={{ 
                                marginBottom: 0,
                                height: 50,
                                backgroundColor: colors.success
                            }}
                            icon={
                                <Icon
                                    name="check"
                                    type="font-awesome-5"
                                    size={15}
                                    color="white"
                                    style={{ marginRight: 12 }}
                                />
                            }
                        />
                    : null 
                : (
                    <Button title="Sudah selesai" disabled buttonStyle={{ 
                        height: 50,
                        backgroundColor: colors.success,
                    }}
                    icon={
                        <Icon
                            name="check"
                            type="font-awesome-5"
                            size={15}
                            color="white"
                            style={{ marginRight: 12 }}
                        />
                    }
                />
                        
                )}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isVisibleModalKumpulkan}
                    onRequestClose={() => {
                        setIsVisibleModalKumpulkan(!isVisibleModalKumpulkan);
                    }}
                >
                    <View style={styles.centeredView}>
                    <View style={{ ...styles.modalView, padding: 20 }}>
                        <AutoHeightImage width={width / 2.5} source={dataModalKumpulkan.statusTelat == 1 ? LateTime : OnTime} />
                        <Text style={styles.modalText}>{ dataModalKumpulkan.message }</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setIsVisibleModalKumpulkan(!isVisibleModalKumpulkan)}
                        >
                            <Text style={styles.textStyle}>Tutup</Text>
                        </Pressable>
                    </View>
                    </View>
                </Modal>
                <SpeedDialComponent
                    fetchPengerjaanTrail={fetchPengerjaanTrail}
                    isSpeedDialOpen={isSpeedDialOpen}
                    setIsSpeedDialOpen={setIsSpeedDialOpen}
                    showModalTask={showModalTask}
                    setShowModalTask={setShowModalTask}
                    containerStyle={{ 
                        marginBottom: 60
                    }}
                />
                <ModalEnableGPS dispatch={dispatch} isModalEnableGPS={isModalEnableGPS} />
            </View>
        )
    } else {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    }
}

const { width, height } = Dimensions.get('screen')

export default map

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#00000052'
    },
    modalView: {
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: width - 60,
        backgroundColor: 'white',
    },
    button: {
        borderRadius: 20,
        padding: 6,
        elevation: 2,
        width: 100,
    },
    buttonClose: {
        backgroundColor: colors.primary,
        marginVertical: 10
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginVertical: 15,
        textAlign: "center",
        fontFamily: 'Poppins-Regular',
        fontSize: RFValue(16, height),
        marginTop: 40
    }
})
