import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { Card, Avatar, Icon, colors } from 'react-native-elements'
import { variable } from '../../../utils'

const index = ({item = null, jarak = 0, navigation}) => {

    if (item != null) {
        return (
            <View>
                <Card>
                    <TouchableOpacity onPress={() => navigation.navigate('TrailDetail', { id_trail: item.id_trail })}>
                    <View style={{ flexDirection:'row' }}>
                        <View style={{ flex: 1, marginRight: 10, justifyContent: 'center' }}>
                            <Avatar rounded size="medium" source={{ uri: `${variable.storage}${item.foto}` }} />
                        </View>
                        <View style={{ flex: 4}}>
                                <Text style={styles.trailTitle}>{item.nama}</Text>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Icon
                                            name="map-pin"
                                            size={15}
                                            color={colors.primary}
                                            type="font-awesome-5"
                                        />
                                            <Text style={{ marginLeft: 10 }}>{item.trail_task[0].task.alamat} </Text>
                                    </View>
                                    <Text>| {jarak} Km</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>{item.user.nama}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', width: 40, justifyContent: 'space-between' }}>
                                        <Icon 
                                            name="tasks"
                                            size={15}
                                            color={colors.primary}
                                            type="font-awesome-5"
                                        />
                                        <Text>{ item.trail_task.length }</Text>
                                    </View>
                                </View>
                        </View>
                    </View>
                    </TouchableOpacity>
                </Card>
            </View>
        )
    }else{
        return null
    }
}

export default index

const styles = StyleSheet.create({})
