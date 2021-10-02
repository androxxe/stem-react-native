import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, View, Dimensions, ScrollView, Alert } from 'react-native'
import { Avatar, Button, Card, colors, Header, Icon, LinearProgress } from 'react-native-elements'
import { RFValue } from 'react-native-responsive-fontsize'
import { LeftBackPage } from '../../components/atoms'
import { axiosGet, axiosPost, requestLocation } from '../../functions'
import { useDispatch, useSelector } from 'react-redux'
import { setLoadingGlobal } from '../../redux'
import { variable } from '../../utils'
import { getPathLength, getDistance } from 'geolib'

const TrailDetail = ({route, navigation}) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const location = useSelector(state => state.location)

    const [trail, setTrail] = useState({})
    const [isLoading, setIsLoading] = useState(true)
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
        } else {
            setTrail({})
        }

        dispatch(setLoadingGlobal(false))
        setIsLoading(false)
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            (async() => {
                await requestLocation({dispatch})
                await fetchTrailDetail()
            })()
        });
      
        return unsubscribe;
    }, [navigation])

    useEffect(() => {
        if(trail?.trail){
            let panjangTemp = getPathLength(trail.trail_task.map(val => {
                return {
                    latitude: val.task.latitude,
                    longitude: val.task.longitude,
                }
            }))
            panjangTemp = panjangTemp / 1000
            panjangTemp = panjangTemp.toFixed(2)
            setPanjang(panjangTemp)
        }
    }, [trail])

    useEffect(() => {
        if(location.status && !isLoading && trail?.trail){
            let jarakTemp = getDistance(
                { latitude: trail.trail_task[0].task.latitude, longitude: trail.trail_task[0].task.longitude },
                { latitude: location?.coords.latitude, longitude: location?.coords.longitude })
            
            jarakTemp = jarakTemp / 1000
            jarakTemp = jarakTemp.toFixed(2)
            setJarak(jarakTemp)
        }
    }, [location])

    const handleMulai = async () => {
        if(trail.trail_user.length == 0 ){
            Alert.alert(
                "Apakah kamu yakin?",
                "Waktu akan dimulai sejak kamu mengambil trail ini",
                [
                    // The "No" button
                    // Does nothing but dismiss the dialog when tapped
                    {
                        text: "Tidak",
                    },
                    // The "Yes" button
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
                                showModalTask: true
                            })
                        },
                      },
                ]
            );
        } else {
            navigation.navigate('TrailMap', {
                // trail,
                id_trail: trail.id_trail,
                showModalTask: false
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
        
        let progress = totalDikerjakan / trail.trail_task.length
        
        return <View style={{  flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ marginRight: 10, fontWeight: 'bold' }}>{ totalDikerjakan }/{ trail.trail_task.length }</Text>
            <LinearProgress style={{ flex: 1 }} color="primary" value={progress} variant="determinate" />
        </View>
    }

    if(isLoading && !trail.trail){
        return null
    } else {
        return (
            <View style={styles.container}>
                <Header 
                    leftComponent={() => LeftBackPage(navigation)}
                    centerComponent={{
                        text: 'DETAIL TRAIL',
                        style: {
                            fontFamily: 'Poppins-Bold',
                            fontSize: RFValue(16, height),
                            color: colors.white,
                        }
                    }}
                />
                <ScrollView>
                    {/* <Text>{JSON.stringify(trail.foto)}</Text> */}
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
                    <Card containerStyle={{ borderRadius: 10, marginTop: -40 }}>
                        <View style={styles.containerFlex}>
                            <View style={{ ...styles.containerMini, marginBottom: 12 }}>
                                <Text style={styles.title}>Kelas</Text>
                                <Text style={styles.subtitle}>{ trail.kelas }</Text>
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
                            <View style={styles.containerMini}>
                                <Text style={styles.title}>Estimasi Durasi</Text>
                                <Text style={styles.subtitle}>{ trail.estimasi_waktu }</Text>
                            </View>
                            <View style={styles.containerMini}>
                                <Text style={styles.title}>Panjang</Text>
                                <Text style={styles.subtitle}>{ panjang } Km</Text>
                            </View>
                        </View>
                    </Card>
                    <Card containerStyle={{ borderRadius: 10 }}>
                        <Text style={{ ...styles.titleTrail, marginBottom: 10 }}>{ trail.nama }</Text>
                        <Card.Divider />
                        <Text style={{ ...styles.subtitleTrail, marginBottom: 10 }}>Perkembangan</Text>
                        <Perkembangan />
                    </Card>
                    <Card containerStyle={{ borderRadius: 10 }}>
                        <Text style={styles.subtitleTrail}>{ trail.keterangan }</Text>
                    </Card>
                </ScrollView>
                <View style={{ 
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width
                }}>
                    <Button 
                        onPress={handleMulai}
                        icon={
                        <Icon
                            name="play"
                            type="font-awesome-5"
                            size={15}
                            color="white"
                            style={{ marginRight: 12 }}
                        /> }
                    // disabled={trail.trail_user.length == 0 ? false : true} 
                    title={trail.trail_user.length == 0 ? "Mulai Trail" : "Lanjutkan Trail"} 
                    buttonStyle={{ height: 50, backgroundColor: trail.trail_user.length == 0 ? colors.primary : colors.success }} />
                </View>
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
        color: colors.grey1
    },
    subtitle: {
        color: 'black',
        fontWeight: 'bold',
    },
    containerMini: {
        alignItems: 'center'
    },
    containerFlex: { 
        flex: 1, 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between' 
    },
    titleTrail: {
        fontFamily: 'Poppins-Bold',
        fontSize: RFValue(16, height)
    },
    subtitleTrail: {
        fontFamily: 'Poppins-Regular',
        fontSize: RFValue(15, height)
    }
})
