import React, { useEffect, useState, useRef, useLayoutEffect, useCallback } from 'react'
import { Text, StyleSheet, View, Dimensions, ScrollView, Alert, TouchableOpacity } from 'react-native'
import { Avatar, Badge, Button, Card, colors, Header, Icon, LinearProgress } from 'react-native-elements'
import { RFValue } from 'react-native-responsive-fontsize'
import { LeftBackPage, ModalEnableGPS } from '../../components/atoms'
import { axiosGet, axiosPost, requestLocation, hasLocationPermission } from '../../functions'
import { useDispatch, useSelector } from 'react-redux'
import { setLoadingGlobal, setIsModalEnableGPS } from '../../redux'
import { variable } from '../../utils'
import { getPathLength, getDistance } from 'geolib'
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';

const TrailDetail = ({route, navigation}) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const { location, statusPermission, isGpsOn, isDenied, isLoadingLocation, isModalEnableGPS } = useSelector(state => state.location)

    const [trail, setTrail] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [isFavorit, setIsFavorit] = useState(false)
    const [totalFavorit, setTotalFavorit] = useState(0)
    const [panjang, setPanjang] = useState(0)
    const [jarak, setJarak] = useState(0)

    const fetchTrailDetail = async () => {
        dispatch(setLoadingGlobal(true))
        setIsLoading(true)

        const { data, message, status } = await axiosGet({dispatch, route: `trail/detail/${route.params.id_trail}`, 
            config: {
                headers: {
                    token: user.token
                },
            },
            isToast: false
        })
        
        if(status == 1){
            setTrail(data)
            setIsFavorit(data.trail_favorit.length > 0 ? true : false)
            setIsLoading(false)
        } else {
            setTrail({})
            alert(message)
        }

        dispatch(setLoadingGlobal(false))
    }

    // 
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

    useFocusEffect(
        useCallback(
            () => {
                fetchTrailDetail()
            },
            [isGpsOn],
        )
    )
    // 

    useEffect(() => {
        if(Object.keys(trail).length > 0){
            let panjangTemp = getPathLength(trail.trail_task.map(val => {
                return {
                    latitude: val.task.latitude,
                    longitude: val.task.longitude,
                }
            }))
            panjangTemp = panjangTemp / 1000
            panjangTemp = panjangTemp.toFixed(2)
            setPanjang(panjangTemp)
            setTotalFavorit(trail.trail_favorit_count)
        }
    }, [trail])

    useEffect(() => {
        if(isGpsOn && !isLoading && Object.keys(trail).length > 0){
            if(trail.trail_task.length > 0){
                let jarakTemp = getDistance(
                    { latitude: trail.trail_task[0].task.latitude, longitude: trail.trail_task[0].task.longitude },
                    { latitude: location?.coords.latitude, longitude: location?.coords.longitude })
                
                jarakTemp = jarakTemp / 1000
                jarakTemp = jarakTemp.toFixed(2)
                setJarak(jarakTemp)
            } else {
                setJarak(0)
            }
        }
    }, [isGpsOn, isLoading, trail])

    const handleFavorit = async () => {
        setIsFavorit(!isFavorit)
        if(isFavorit){
            setTotalFavorit(totalFavorit - 1)
        } else {
            setTotalFavorit(totalFavorit + 1)
        }
        const response = await axiosPost({ dispatch, route: 'trail/favorit', 
            data: {
                id_trail: trail.id_trail,
                is_favorit: !isFavorit
            },
            headers: {
                token: user.token
            },
            isToast: false   
        })
    }

    const handleMulai = async () => {
        let totalDikerjakan = 0
        trail.trail_task.map(val => {
            if(val.task.task_answer.length > 0){
                totalDikerjakan++
            }    
        })

        if(trail.trail_user.length == 0 ){
            Alert.alert(
                "Apakah kamu yakin?",
                "Waktu akan dimulai sejak kamu mengambil trail ini",
                [
                    {
                        text: "Tidak",
                    },
                    {
                        text: "Ya",
                        onPress: async () => {
                            dispatch(setLoadingGlobal(true))
                            const response = await axiosPost({dispatch, route: 'trail/claim', 
                                data: {
                                    id_trail: trail.id_trail,
                                },
                                headers: {
                                    token: user.token
                                }
                            })
                            dispatch(setLoadingGlobal(false))  
                            if(response.status == 0){
                                return;
                            }
                            navigation.navigate('TrailMap', {
                                // trail,
                                id_trail: trail.id_trail,
                                showModalTask: totalDikerjakan == 0 ? true : false
                            })
                        },
                      },
                ]
            );
        } else {
            navigation.navigate('TrailMap', {
                // trail,
                id_trail: trail.id_trail,
                showModalTask: totalDikerjakan == 0 ? true : false
            })
        }

    }

    const Perkembangan = () => {
        let totalDikerjakan = 0
        trail.trail_task.map(val => {
            if(val.task.task_answer.length > 0){
                totalDikerjakan++
            }    
        })
        
        let progress = 0;
        if(trail.trail_task.length > 0){
            progress = totalDikerjakan / trail.trail_task.length
        }

        return <View style={{  flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ marginRight: 10, fontWeight: 'bold' }}>{ totalDikerjakan }/{ trail.trail_task.length }</Text>
            <LinearProgress style={{ flex: 1 }} color="primary" value={progress} variant="determinate" />
        </View>
    }

    const totalSkor = () => {
        let totalSkor = 0
        trail.trail_task.map(val => {
            if(val.task.task_answer.length > 0){
                totalSkor = totalSkor + val.task.task_answer[0].score
            }
        })

        return totalSkor
    }

    const hitungSoalBelumDinilai = () => {
        let totalSoalBelumDinilai = 0

        trail.trail_task.map(val => {
            if(val.task.task_answer.length > 0){
                if(val.task.task_answer[0].score == null){
                    totalSoalBelumDinilai++
                }
            }
        })

        if(totalSoalBelumDinilai > 0){
            return <Text style={{
                marginTop: 10,
                color: colors.grey2
            }}>{ totalSoalBelumDinilai } tugas belum diperiksa</Text>
        } else {
            return null
        }
    }

    if(isLoading && !trail.trail){
        return null
    } else {
        return (
            <View style={styles.container}>
                <Header 
                    leftComponent={() => LeftBackPage(navigation)}
                    centerComponent={{
                        text: 'DETAIL RUTE',
                        style: {
                            fontFamily: 'Poppins-Bold',
                            fontSize: RFValue(18, height),
                            color: colors.white,
                        }
                    }}
                />
                <ScrollView>
                    <View style={{ 
                        marginTop: 16,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                        width: 'auto',
                        alignItems: 'center'
                    }}>
                        <Avatar size="xlarge" rounded containerStyle={{ 
                            borderWidth: 1,
                            borderColor: colors.grey4,
                            backgroundColor: 'white'
                        }} source={{uri: `${variable.storage}${trail.foto}`}} />
                    </View>
                    <View style={{ 
                        position: 'absolute',
                        zIndex: 1000,
                        elevation: 5,
                        right: 10,
                        top: 50,
                        alignItems: 'center',
                        padding: 10,
                    }}>
                        <Text style={{ fontFamily: 'Poppins-Bold', marginBottom: 0, paddingBottom: 0, color: colors.error }}>{ totalFavorit }</Text>
                        <Icon
                            name="heart"
                            type="font-awesome-5"
                            solid={isFavorit}
                            color={colors.error}
                            raised
                            containerStyle={{ 
                                marginTop: 0,
                            }}
                            onPress={handleFavorit} 
                        />
                    </View>
                    <Card containerStyle={{ borderRadius: 10, marginTop: -54 }}>
                        <View style={{ ...styles.containerFlex, marginTop: 20 }}>
                            <View style={{ ...styles.containerMini }}>
                                <Text style={styles.title}>Kelas</Text>
                                <Text style={styles.subtitle}>{ trail.kelas }</Text>
                            </View>
                            <View style={{ ...styles.containerMini, flex: 1.5 }}>
                                { trail.trail_user.length > 0 ?
                                    trail.trail_user[0].status == 1 ?
                                        <Text style={{ 
                                            marginTop: 20,
                                            fontFamily: 'Poppins-Bold',
                                            color: 'white',
                                            backgroundColor: colors.success,
                                            paddingHorizontal: 20,
                                            borderRadius: 20
                                        }}>Selesai</Text>
                                    : null : null
                                }
                            </View>
                            <View style={styles.containerMini}>
                                <Text style={styles.title}>Tugas</Text>
                                <Text style={styles.subtitle}>{ trail.trail_task?.length }</Text>
                            </View>
                        </View>
                        <View style={styles.containerFlex}>
                            <View style={styles.containerMini}>
                                <Text style={styles.title}>Jarak</Text>
                                <Text style={styles.subtitle}>{ jarak } Km</Text>
                            </View>
                            <View style={{ ...styles.containerMini, flex: 1.5 }}>
                                <Text style={styles.title}>Panjang</Text>
                                <Text style={styles.subtitle}>{ panjang } Km</Text>
                            </View>
                            <View style={styles.containerMini}>
                                <Text style={styles.title}>Jlh. Siswa</Text>
                                <Text style={styles.subtitle}>{ trail.trail_user_count }</Text>
                            </View>
                        </View>
                        <View style={styles.containerFlex}>
                            {/* <View style={{ ...styles.containerMini, flex: 1.5 }}>
                                <Text style={styles.title}>Waktu pengerjaan</Text>
                                <Text style={styles.subtitle}>{ trail.processing_time }</Text>
                            </View> */}
                        </View>
                        <Card.Divider />
                        <View style={styles.containerVertical}>
                            <View>
                                <Text style={{ ...styles.title, textAlign: 'left' }}>Alamat:</Text>
                                <Text style={{ ...styles.subtitle, textAlign: 'left' }}>
                                    { trail.trail_task.length > 0 ? trail.trail_task[0].task.alamat : '-' }
                                </Text>
                            </View>
                        </View>
                        <View style={styles.containerVertical}>
                            <View>
                                <Text style={{ ...styles.title, textAlign: 'left' }}>Estimasi Waktu:</Text>
                                <Text style={{ ...styles.subtitle, textAlign: 'left' }}>{ trail.estimasi_waktu }</Text>
                            </View>
                        </View>
                        {/* { trail.last_submit || trail.processing_time ?
                            <View style={styles.containerVertical}>
                                <View>
                                    <Text style={{ ...styles.title, textAlign: 'left' }}>
                                        { trail.last_submit ? 
                                            'Dikumpulkan sebelum:' 
                                        : trail.processing_time ? 
                                            'Waktu pengerjaan:' 
                                            : null 
                                        }
                                    </Text>
                                    <Text style={{ ...styles.subtitle, textAlign: 'left' }}>
                                        { trail.last_submit ? 
                                            trail.last_submit
                                        : trail.processing_time ? 
                                            trail.processing_time
                                            : null 
                                        }
                                    </Text>
                                    
                                </View>
                            </View>
                        : null } */}
                    </Card>
                    <Card containerStyle={{ borderRadius: 10 }}>
                        <Text style={{ ...styles.titleTrail, marginBottom: 12 }}>{ trail.nama }</Text>
                        <Card.Divider />
                        <Text style={{ ...styles.subtitleTrail, marginBottom: 12 }}>Perkembangan</Text>
                        <Perkembangan />
                        { trail.trail_user.length > 0 ?
                            <View>
                                <Text style={{ ...styles.title, textAlign: 'left', marginTop: 16 }}>Dimulai pada:</Text>
                                <Text style={{ ...styles.subtitle, textAlign: 'left' }}>{ trail.trail_user[0].created_at_string }</Text>
                                <Text style={{ ...styles.title, textAlign: 'left', marginTop: 12 }}>Dikumpulkan sebelum:</Text>
                                <Text style={{ ...styles.subtitle, textAlign: 'left' }}>{ trail.trail_user[0].deadline_at ? trail.trail_user[0].deadline_at : '-' }</Text>
                                <Text style={{ ...styles.title, textAlign: 'left', marginTop: 12 }}>Dikumpulkan pada:</Text>
                                <Text style={{ ...styles.subtitle, textAlign: 'left' }}>{ trail.trail_user[0].finished_at ? trail.trail_user[0].finished_at : '-' }</Text>
                                <Text style={{ ...styles.title, textAlign: 'left', marginTop: 12 }}>Total nilai:</Text>
                                <View style={{ width: 80 }}>
                                    <Text style={{ ...styles.subtitle, width: 'auto', color: colors.success, borderWidth: 1, borderColor: colors.success, paddingTop: 4, paddingHorizontal: 10, borderRadius: 20 }}>
                                        { totalSkor() }
                                    </Text>
                                </View>
                                { hitungSoalBelumDinilai() }
                            </View>
                        : null }
                    </Card>
                    <Card containerStyle={{ borderRadius: 10 }}>
                        <Text style={styles.subtitleTrail}>{ trail.keterangan }</Text>
                    </Card>
                    <Card containerStyle={{ borderRadius: 10, marginBottom: 70 }}>
                        <Text style={styles.questionTitle}>Author</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                            <Avatar
                                size="medium"
                                rounded
                                source={{
                                    uri: `${variable.storage}${trail.user.foto}`,
                                }}
                            />
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={styles.question}>{ trail.user.nama }</Text>
                                <Text style={{ ...styles.question, color: colors.grey3, fontSize: 16 }}>{ trail.user.email }</Text>
                            </View>
                        </View>
                    </Card>
                </ScrollView>
                <View style={{ 
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width
                }}>
                    { trail.trail_task.length > 0 ? ( 
                        <Button 
                            onPress={handleMulai}
                            icon={
                                trail.trail_user.length == 0 ?
                                <Icon
                                    name="play"
                                    type="font-awesome-5"
                                    size={15}
                                    color="white"
                                    style={{ marginRight: 12 }}
                                />
                                : trail.trail_user[0].status == 1 ?
                                <Icon
                                    name="eye"
                                    type="font-awesome-5"
                                    size={15}
                                    color="white"
                                    style={{ marginRight: 12 }}
                                />
                                : <Icon
                                    name="play"
                                    type="font-awesome-5"
                                    size={15}
                                    color="white"
                                    style={{ marginRight: 12 }}
                                />}
                        title={trail.trail_user.length == 0 ? "Mulai Trail" : trail.trail_user[0].status == 1 ? "Lihat Trail" : "Lanjutkan Trail"} 
                        buttonStyle={{ height: 50, backgroundColor: trail.trail_user.length == 0 ? colors.primary : colors.success }} />
                    ) : (
                        <Button 
                            title="Tidak ada rute untuk dikerjakan" 
                            buttonStyle={{ height: 50, backgroundColor: colors.grey4 }} />
                    )}
                </View>
                <ModalEnableGPS dispatch={dispatch} isModalEnableGPS={isModalEnableGPS} />
            </View>
        )
    }
}

export default TrailDetail

const {width, height} = Dimensions.get('window')

const styles = StyleSheet.create({
    container:{
        display: 'flex',
        flex: 1
    },
    title: { 
        color: colors.grey1,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
        fontSize: RFValue(16, height)
    },
    subtitle: {
        color: 'black',
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
        fontSize: RFValue(16, height)
    },
    containerMini: {
        alignItems: 'center',
        flex: 1,
    },
    containerFlex: { 
        flex: 1, 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between',
        marginBottom: 18
    },
    titleTrail: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: RFValue(16, height),
        color: colors.success
    },
    subtitleTrail: {
        fontFamily: 'Poppins-Regular',
        fontSize: RFValue(16, height)
    },
    containerVertical: { 
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    question: {
        fontSize: RFValue(16, height),
        fontFamily: 'Poppins-Regular',
        marginHorizontal: 10
    },
    questionTitle: {
        fontSize: RFValue(16, height),
        fontFamily: 'Poppins-Bold',
        fontWeight: 'bold',
        color: colors.grey3,
        marginBottom: 6
    },
})
