import React from 'react'
import { View, Dimensions } from 'react-native'
import { Image } from 'react-native-elements'
import ImageZoom from 'react-native-image-pan-zoom'

const ImagePanZoom = ({navigation, route}) => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ImageZoom cropWidth={width}
                    cropHeight={height}
                    imageWidth={200}
                    imageHeight={200}>
                <Image style={{width:200, height:200}}
                    source={{uri: route.params.image}}/>
            </ImageZoom>
        </View>
    )
}

const { width, height } = Dimensions.get('window')

export default ImagePanZoom
