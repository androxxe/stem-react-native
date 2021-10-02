import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions, StyleSheet, Modal, Pressable, ActivityIndicator, Alert } from 'react-native'
import { colors, Header, SpeedDial, ListItem, BottomSheet, Button, Avatar } from 'react-native-elements'
import MapView, { Marker } from 'react-native-maps'
import { RFValue } from 'react-native-responsive-fontsize'
import { LeftBackPage } from '../../components/atoms'
import { axiosGet, requestLocation } from '../../functions'
import { useDispatch, useSelector } from 'react-redux'
import { getCenter } from 'geolib'
import { variable } from '../../utils'
import user from '../../redux/user'
import { useToastErrorDispatch } from '../../hooks'

const SpeedDialComponent = ({ setIsSpeedDialOpen, isSpeedDialOpen, showModalTask, setShowModalTask}) => {
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
                // title="Ulang"
                onPress={() => console.log('Delete Something')}
                color={colors.primary}
            />
        </SpeedDial>
    )
}
const map = ({ navigation, route}) => {
    const dispatch = useDispatch()
    const [trail, setTrail] = useState(null)
    const [title, setTitle] = useState('Task')
    const [isLoading, setIsLoading] = useState(true)
    const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false)
    const [isVisibleBottomSheetTask, setIsVisibleBottomSheetTask] = useState(false)
    const [center, setCenter] = useState(false)
    const [showModalTask, setShowModalTask] = useState(false)
    const [dataBottomSheetMask, setDataBottomSheetMask] = useState(false)
    
    const location = useSelector(state => state.location)
    const user = useSelector(state => state.user)
    const errorDispatcher = useToastErrorDispatch()

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            (async() => {
                await fetchPengerjaanTrail()
                setShowModalTask(route.params.showModalTask)
                await requestLocation({dispatch})
            })()
        });
    }, [])

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

    useEffect(() => {
        if(location.status == true && trail){
            setCenter(getCenter(trail.trail_task.map(val => {
                return {
                    latitude: val.task.latitude,
                    longitude: val.task.longitude,
                }
            })))
        }
    }, [location])

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
                    trail_task: val
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
                            trail_task: val
                        })
                        setIsVisibleBottomSheetTask(false)
                        return
                    } else {
                        Alert.alert(`Kerjakan trail secara berurut`, 
                            "Pengerjaan task pada trail ini harus dikerjakan secara berurutan")
                    }
                } else {
                    if(val.sequence == 1){
                        navigation.navigate('TaskQuestion', {
                            trail_task: val
                        })
                        setIsVisibleBottomSheetTask(false)
                    } else {
                        Alert.alert("Kerjakan trail secara berurut", 
                            "Pengerjaan task pada trail ini harus dikerjakan secara berurutan")
                    }
                }
            } else {
                Alert.alert("Kerjakan trail secara berurut", 
                    "Pengerjaan task pada trail ini harus dikerjakan secara berurutan")
            }
        } else {
            navigation.navigate('TaskQuestion', {
                trail_task: val
            })
            setIsVisibleBottomSheetTask(false)
            return
        }
    }

    const ModalListTask = () => {
        return (
            <Modal
                animationType="slide"
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
                                {/* <Icon name={item.icon} /> */}
                                <ListItem.Content>
                                    <ListItem.Title>
                                        { val.task.judul }
                                    </ListItem.Title>
                                </ListItem.Content>
                                <ListItem.Chevron />
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
    if(trail){
        return (
            <View style={styles.container}>
                <Header 
                    leftComponent={() => LeftBackPage(navigation)}
                    centerComponent={{
                        text: title,
                        style: {
                            fontFamily: 'Poppins-Bold',
                            fontSize: RFValue(16, height),
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
                    >
                        {trail.trail_task.map((val, index) => 
                            <Marker
                                key={index}
                                coordinate={{ 
                                    latitude: val.task.latitude,
                                    longitude: val.task.longitude,
                                }}
                                title={`#${val.sequence} ${val.task.judul}`}
                                onPress={() => handleClickMarker(val)}
                            />
                        )}
                    </MapView>
                )}
                <SpeedDialComponent
                    isSpeedDialOpen={isSpeedDialOpen}
                    setIsSpeedDialOpen={setIsSpeedDialOpen}
                    showModalTask={showModalTask}
                    setShowModalTask={setShowModalTask}
                />
                <ModalListTask />
                <BottomSheet
                    isVisible={isVisibleBottomSheetTask}
                    containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
                >
                    { dataBottomSheetMask ?
                        <View style={{ backgroundColor: 'white', padding: 20 }}>
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
                                <Button onPress={() => handleMenujuTugas(dataBottomSheetMask)} title="Menuju ke tugas" style={{ width: 200 }} />
                            </View>
                        </View>
                    : null }
                </BottomSheet>
            </View>
        )
    } else {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    }
}

const { width, height } = Dimensions.get('window')

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
        marginBottom: 15,
        textAlign: "center"
    }
})
