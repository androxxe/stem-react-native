import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { colors } from '../../../utils'
import { useSelector } from 'react-redux'
import { Loading } from '../../../assets/animations'
import AutoHeightImage from 'react-native-auto-height-image'


const index = () => {
    const { loading } = useSelector(state => state.loadingGlobal)
    if(loading){
        return (
            <View style={styles.loaderContainer}>
                <View style={{ 
                    height: 100,
                    width: 100,
                    overflow: 'hidden',
                    borderRadius: 50,
                }}>
                <AutoHeightImage source={Loading} width={100} />
                </View>
            </View> 
            )
    }else{
        return null;
    }
}

export default index
const {width, height} = Dimensions.get('screen')
const styles = StyleSheet.create({
    loaderContainer : {
        display: 'flex',
        elevation: 2,
        height: '100%',
        width,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.hitamTransparent,
      },
})
