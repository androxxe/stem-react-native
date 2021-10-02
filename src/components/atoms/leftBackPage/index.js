import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'

const index = () => {
    const navigation = useNavigation()
    return (
        <View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon
                        name="arrow-left"
                        size={20}
                        color="white"
                        type="font-awesome-5"
                    />
                </TouchableOpacity>
        </View>
    )
}

export default index

const styles = StyleSheet.create({})
