import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image'
import { BottomSheet, Button } from 'react-native-elements'
import { RFValue } from 'react-native-responsive-fontsize'
import { MapIcon } from '../../../assets/images'
import { requestLocation } from '../../../functions'

const ModalEnableGPS = ({dispatch, isModalEnableGPSVisible, setIsModalEnableGPSVisible}) => {
    const handleTutup = async () => {
        requestLocation({dispatch})
        setIsModalEnableGPSVisible(false)
    }

    return (
        <BottomSheet
            isVisible={isModalEnableGPSVisible}
            containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
            >
            <View style={{ 
                backgroundColor: 'white',
                alignItems: 'center',
                paddingVertical: 40,
                paddingHorizontal: 20
            }}>
                <AutoHeightImage source={MapIcon} width={width / 2} />
                <Text style={{ 
                    fontFamily: 'Poppins-Bold',
                    fontSize: RFValue(17, height),
                    textAlign: 'center'
                }}>Layanan GPS kamu tidak aktif / diizinkan</Text>
                <Text style={{ 
                    fontFamily: 'Poppins-Regular',
                    textAlign: 'center'
                }}>Mohon aktifkan GPS kamu untuk dapat menggunakan aplikasi STEM, lalu coba ulang kembali</Text>
                <Button buttonStyle={{ 
                    width: width - 40,
                    marginTop: 20
                }} onPress={handleTutup} title="Tutup" />
            </View>
        </BottomSheet>
    )
}

const { height, width } = Dimensions.get('window')

export default ModalEnableGPS
