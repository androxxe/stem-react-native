import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { colors, Icon } from 'react-native-elements'
import { RFValue } from 'react-native-responsive-fontsize'

const NoData = ({title, subtitle}) => {
    return (
        <View style={{ 
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingHorizontal: 12,
        }}>    
            <Icon
                name='slash'
                color={colors.grey4}
                type='feather'
                size={140}
            />
            <Text style={{ textAlign: 'center', marginHorizontal: 10, marginTop: 20, fontFamily: 'Poppins-SemiBold', fontSize: RFValue(20, height), color: colors.grey0 }}>{ title }</Text>
            <Text style={{ textAlign: 'center', marginHorizontal: 20, fontFamily: 'Poppins-Regular', fontSize: RFValue(15, height), color: colors.grey2 }}>{ subtitle }</Text>
        </View>
    )
}

const { height, width } = Dimensions.get('window')

export default NoData
