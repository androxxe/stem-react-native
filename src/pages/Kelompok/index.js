import React, { useEffect, useState, useLayoutEffect, useRef} from 'react'
import { View, Dimensions, TouchableOpacity, Alert, Text, ScrollView } from 'react-native'
import { Header, Image, colors, Icon, Button, ListItem, Avatar } from 'react-native-elements'
import { RFValue } from 'react-native-responsive-fontsize'
import { LeftBackPage, NoData } from '../../components/atoms'
import { axiosGet, axiosPost } from '../../functions'
import { useDispatch, useSelector } from 'react-redux'
import { setLoadingGlobal } from '../../redux'

const Kelompok = ({navigation, route}) => {
    const [kelompok, setKelompok] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const dispatch = useDispatch()

    const user = useSelector(state => state.user)

    const firstUpdate = useRef(true);
    useLayoutEffect(() => {
        if (firstUpdate.current) {
            (async() => {
                dispatch(setLoadingGlobal(true))
                await fetchKelompok()
                dispatch(setLoadingGlobal(false))
            })()
            firstUpdate.current = false;
        }
        
        const unsubscribe = navigation.addListener('focus', () => {
            (async() => {
                await fetchKelompok()
            })()
        })
        return unsubscribe
    }, []);

    const fetchKelompok = async () => {
        setIsLoading(true)
        dispatch(setLoadingGlobal(true))
        const { data, status, message } = await axiosGet({dispatch, route: 'kelompok',
            config: {
                headers: {
                    token: user.token
                }
            },
            isToast: false
        })
        setKelompok(data)
        dispatch(setLoadingGlobal(false))
        setIsLoading(false)
    }

    const TambahKelompok = () => {
        return (
            <TouchableOpacity style={{ 
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end'
            }}
            onPress={() => {
                navigation.navigate('KelompokTambah')
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

    const handleDelete = async (val) => {
        try {
            Alert.alert(
                "Apakah kamu yakin?",
                "Data yang dihapus tidak dapat dikembalikan",
                [
                    { text: "OK", onPress: async () => {
                        dispatch(setLoadingGlobal(true))
                        const response = await axiosPost({dispatch, route: 'kelompok/hapus', 
                            headers: {
                                token: user.token
                            },
                            data: {
                                id_kelompok: val.id_kelompok
                            }
                        })
                        dispatch(setLoadingGlobal(false))
                        fetchKelompok()
                    }},
                    {
                        text: "Batal",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                ]
            );
        } catch (e) {
            alert(JSON.stringify(e))
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header 
                leftComponent={() => LeftBackPage(navigation)}
                centerComponent={{
                    text: 'KELOMPOK',
                    style: {
                        fontFamily: 'Poppins-Bold',
                        fontSize: RFValue(18, height),
                        color: colors.white,
                    }
                }}
                rightComponent={<TambahKelompok />}
            />
            <ScrollView style={{flex: 1}}>
                { !isLoading ?
                    kelompok.length > 0 ?
                        kelompok.map((val, index) => (
                            <ListItem.Swipeable
                                rightContent={
                                    <View style={{ flexDirection: 'row',justifyContent: 'flex-end'}}>
                                        <Button
                                            onPress={() => navigation.navigate('KelompokEdit', val)}
                                            icon={{ name: 'edit', color: 'white' }}
                                            buttonStyle={{ minHeight: '100%', backgroundColor: colors.primary, marginRight: 6 }}
                                        />
                                        <Button
                                            onPress={() => handleDelete(val)}
                                            icon={{ name: 'delete', color: 'white' }}
                                            buttonStyle={{ minHeight: '100%', backgroundColor: colors.error }}
                                        />
                                    </View>
                                }
                                key={`kelompok_${index}`} bottomDivider>
                                <ListItem.Content>
                                    <ListItem.Title>{val.nama}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem.Swipeable>
                        ))
                    : <View>
                        <View style={{ marginTop: 100 }}>
                            <NoData title="Tidak ada anggota kelompok"/>
                        </View>
                    </View>
                : null }
            </ScrollView>
        </View>
    )
}

const { width, height } = Dimensions.get('window')

export default Kelompok
