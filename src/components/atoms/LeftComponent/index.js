import React from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import { colors, Icon } from 'react-native-elements'
import { RFValue } from 'react-native-responsive-fontsize'

const LeftComponent = ({navigation, title}) => {
    return <View style={{ 
        flexDirection: 'row',
        width: '100%',
     }}>
        <TouchableOpacity onPress={() => navigation.goBack() }>
            <Icon
                name="chevron-left"
                color="white"
                type="font-awesome-5"
            />
        </TouchableOpacity>
        <Text style={{
            color: colors.white,
            fontFamily: 'Poppins-Bold',
            fontSize: RFValue(16, height),
            width: width - 64,
            marginLeft: 20,
        }}
            numberOfLines={1}
            ellipsizeMode='tail'            
        >{ title }</Text>
    </View>
}

const { width, height } = Dimensions.get('window')

export default LeftComponent
