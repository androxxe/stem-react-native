import React, { useEffect, useRef } from 'react'
import { TouchableWithoutFeedback, View, Text, StyleSheet, Dimensions, Animated } from 'react-native'
import { colors } from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux';
import { RFValue } from 'react-native-responsive-fontsize'
import { setToast } from '../../../redux'
import Constants from 'expo-constants'

const handleOnPress = ({toast, dispatch, setToast}) => {
  if(toast.aksi.type == 'close'){
    dispatch(setToast({show: false}));
  }  
}

const ToastSuccess = () => {
  const { toast }  = useSelector(state => state.toast);
  const dispatch = useDispatch();
  const heightToast = useRef(new Animated.Value(-150)).current;
  const animOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if(toast.show){
      Animated.timing(heightToast, {
        toValue: 24,
        duration: 400,
        useNativeDriver: true
      }).start();

      setTimeout(() => {
        Animated.timing(animOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        }).start();

        setTimeout(() => {
          dispatch(setToast({show: false}))
        }, 500);
      }, toast.time);
    }
  }, [toast.show])

  if (toast.show && toast.text && toast.type == 'success') {
    return (
      <Animated.View style={{ ...styles.loaderContainer, opacity: animOpacity, transform: [{
          translateY: heightToast
      }]}}>
        <View style={{ ...styles.cardToast, backgroundColor: colors.success }}>
          <Text style={{ ...styles.textToast, flexWrap: 'wrap', paddingRight: 5, flex:1, color: colors.white }}>{toast.text}</Text>
          <TouchableWithoutFeedback onPress={() => handleOnPress({toast, dispatch, setToast})}>
              <Text style={{ ...styles.textAksi, color: colors.success }}>{toast.textAksi}</Text>
          </TouchableWithoutFeedback>
        </View>
      </Animated.View>
    )
  } else {
      return null
  }
}

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  loaderContainer : {
    marginTop: Constants.statusBarHeight,
    alignSelf: 'flex-end',
    width: width,
    position: 'absolute',
    elevation: 5,
    zIndex: 1000000
  },
  textToast: {
    color: colors.black,
    fontFamily: 'Poppins-Regular'
  },
  cardToast: {
    marginHorizontal: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  textAksi: {
    fontSize: RFValue(13, height)
  }
})
export default ToastSuccess;
