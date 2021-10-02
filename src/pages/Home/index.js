import React, { Component } from 'react'
import { Text, StyleSheet, View, ActivityIndicator, FlatList, Dimensions, TouchableNativeFeedback } from 'react-native'
import Constants from 'expo-constants'
import { colors } from 'react-native-elements'
import { Card, Image, Icon } from 'react-native-elements'
import { logoSingleText } from '../../assets/images'
import { RFValue } from 'react-native-responsive-fontsize'

const index = ({ navigation }) => {
    const menu = [
        {
            title: 'Kelas',
            subtitle: 'Daftar kelas yang kamu ikuti',
            image: 'https://yt3.ggpht.com/ytc/AKedOLR0Q2jl80Ke4FS0WrTjciAu_w6WETLlI0HmzPa4jg=s900-c-k-c0x00ffffff-no-rj',
            onPress: () => {
                navigation.navigate('Kelas')
            },
            icon: 'list-alt'
        },
        {
            title: 'Cari Trail',
            subtitle: 'Cari & jelajahi trail baru',
            image: 'https://yt3.ggpht.com/ytc/AKedOLR0Q2jl80Ke4FS0WrTjciAu_w6WETLlI0HmzPa4jg=s900-c-k-c0x00ffffff-no-rj',
            onPress: () => {
                navigation.navigate('Trail')
            },
            icon: 'route'
        },
        {
            title: 'Masuk kelas',
            subtitle: 'Masuk kelas melalui kode',
            image: 'https://yt3.ggpht.com/ytc/AKedOLR0Q2jl80Ke4FS0WrTjciAu_w6WETLlI0HmzPa4jg=s900-c-k-c0x00ffffff-no-rj',
            onPress: () => {
                navigation.navigate('KelasTambah')
            },
            icon: 'sign-in-alt'
        },
        {
            title: 'Trail saya',
            subtitle: 'Cari & jelajahi trail baru',
            image: 'https://yt3.ggpht.com/ytc/AKedOLR0Q2jl80Ke4FS0WrTjciAu_w6WETLlI0HmzPa4jg=s900-c-k-c0x00ffffff-no-rj',
            onPress: () => {
                navigation.navigate('TrailSaya')
            },
            icon: 'road'
        },
    ]
    return (
        <View style={styles.container}>
            <View style={{ 
                // marginTop: Constants.statusBarHeight
             }}>
                <View style={{ 
                    alignItems: 'center',
                    borderRadius: 12,
                    backgroundColor: 'white',
                    paddingVertical: 24,
                    marginHorizontal: 20
                 }}>
                    <Image
                        source={logoSingleText}
                        style={{ width: 140, height: 140 }}
                        PlaceholderContent={<ActivityIndicator />}
                    />
                </View>
                <View style={{
                    // flex: 1,
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    justifyContent: 'space-between'
                 }}>
                    <FlatList 
                        data={menu}
                        keyExtractor={(item, index) => `${index}`}     //has to be unique   
                        renderItem={item => (
                            <TouchableNativeFeedback style={{ borderRadius: 12 }} onPress={item.item.onPress}>
                                <Card containerStyle={styles.containerCard}>
                                        <Icon 
                                            name={item.item.icon}
                                            color={colors.primary}
                                            size={40}
                                            type='font-awesome-5'
                                        />
                                        <Text style={styles.title}>{ item.item.title }</Text>
                                        <Text style={styles.subtitle}>{ item.item.subtitle }</Text>
                                </Card>
                            </TouchableNativeFeedback>
                        )} 
                        horizontal={false}
                        numColumns={2}
                    />
                </View>
             </View>
        </View>
    )
}

const { width, height } = Dimensions.get('window')

export default index

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        flex: 1, 
        justifyContent: 'center'
    },
    textInput:{
        paddingHorizontal: 10
    },
    containerCard: {
        flex: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        marginTop: 16,
        fontFamily: 'Poppins-SemiBold',
        fontSize: RFValue(18, height),
        color: colors.primary,
        textAlign: 'center'
    },
    subtitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: RFValue(15, height),
        textAlign: 'center'
    }
})
