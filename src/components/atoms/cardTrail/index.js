import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native'
import { Card, Avatar, Icon, colors, Tooltip } from 'react-native-elements'
import { RFValue } from 'react-native-responsive-fontsize'
import { variable } from '../../../utils'

const index = ({item = null, jarak = 0, navigation}) => {

    if (item != null) {
        return (
            <Card containerStyle={{ 
                borderRadius: 20
            }}>
                <TouchableOpacity onPress={() => navigation.navigate('TrailDetail', { id_trail: item.id_trail })}>
                    <View style={{ flexDirection:'row' }}>
                        <View style={{ marginRight: 20, justifyContent: 'center' }}>
                            <Avatar rounded size="medium" source={{ uri: `${variable.storage}${item.foto}` }} />
                        </View>
                        <View style={{ flex: 1}}>
                            <Text style={styles.trailTitle}>{item.nama}</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12}}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Icon
                                        name="map-pin"
                                        size={18}
                                        color={colors.primary}
                                        type="font-awesome-5"
                                    />
                                    <Text style={{ 
                                        marginLeft: 10,
                                        marginRight: 4
                                    }}>{ item.trail_task[0].task.alamat } </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <Card.Divider />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Tooltip popover={<Text>Estimasi jarak Trail dari tempat kamu</Text>}>
                                    <Icon
                                        name="map-marker-alt"
                                        size={14}
                                        color={colors.primary}
                                        type="font-awesome-5"
                                    />
                                </Tooltip>
                                <Text style={{ fontFamily: 'Poppins-Regular', marginLeft: 4 }}>{ jarak } km</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Tooltip popover={<Text>Pemilik Trail</Text>}>
                                    <Icon
                                        name="user"
                                        size={14}
                                        color={colors.primary}
                                        type="font-awesome-5"
                                    />
                                </Tooltip>
                                <Text style={{ fontFamily: 'Poppins-Regular', marginLeft: 4 }}>{ item.user.nama }</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Tooltip popover={<Text>Jumlah Trail</Text>}>
                                    <Icon
                                        name="tasks"
                                        size={14}
                                        color={colors.primary}
                                        type="font-awesome-5"
                                    />
                                </Tooltip>
                                <Text style={{ fontFamily: 'Poppins-Regular', marginLeft: 4 }}>{ item.trail_task.length }</Text>
                            </View>
                        </View>
                </TouchableOpacity>
            </Card>
        )
    }else{
        return null
    }
}

export default index

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
    trailTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: RFValue(16, height),
        color: colors.primary
    },
    trailKeterangan: {

    }
})
