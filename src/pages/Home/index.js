import React from 'react'
import { Text, StyleSheet, View, ActivityIndicator, FlatList, Dimensions, TouchableNativeFeedback } from 'react-native'
import { colors } from 'react-native-elements'
import { Card, Image, Icon } from 'react-native-elements'
import { logoSingleText } from '../../assets/images'
import { RFValue } from 'react-native-responsive-fontsize'
import { ScrollView } from 'react-native-gesture-handler';
import Constants from 'expo-constants'

const index = ({ navigation }) => {
    const menu = [
        {
            title: 'Kelas',
            subtitle: 'Daftar kelas yang kamu ikuti',
            onPress: () => {
                navigation.navigate('Kelas')
            },
            icon: 'list-alt'
        },
        {
            title: 'Cari Rute',
            subtitle: 'Cari & jelajahi rute baru',
            onPress: () => {
                navigation.navigate('Trail')
            },
            icon: 'route'
        },
        {
            title: 'Masuk kelas',
            subtitle: 'Masuk kelas melalui kode',
            onPress: () => {
                navigation.navigate('KelasTambah')
            },
            icon: 'sign-in-alt'
        },
        {
            title: 'Rute saya',
            subtitle: 'Cari & jelajahi rute baru',
            onPress: () => {
                navigation.navigate('TrailSaya')
            },
            icon: 'road'
        },
    ]
    return (
        <View style={styles.container}>
            <ScrollView style={{ 
                paddingTop: Constants.statusBarHeight + 20
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
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 19,
                    marginTop: 10,
                    paddingBottom: 60
                }}>
                    { menu.map((item, index) => 
                        <TouchableNativeFeedback key={`menu_${index}`} onPress={item.onPress}>
                            <Card containerStyle={styles.containerCard}>
                                <Icon 
                                    name={item.icon}
                                    color={colors.primary}
                                    size={36}
                                    type='font-awesome-5'
                                />
                                <Text style={styles.title}>{ item.title }</Text>
                                <Text style={styles.subtitle}>{ item.subtitle }</Text>
                            </Card>
                        </TouchableNativeFeedback>
                    )} 
                </View>
            </ScrollView>
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
        // flex: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        width: (width / 2) - 30,
        height: (width / 2) - 30,
        marginHorizontal: 0,
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
