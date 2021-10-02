import react from 'react'
import * as Location from 'expo-location';
import { setLocation, setStatus } from '../redux'

const requestLocation = async ({ dispatch }) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        dispatch(setStatus(false))
        return;
    }
    
    let location = await Location.getCurrentPositionAsync({});
    dispatch(setStatus(true))
    dispatch(setLocation(location))
}

export default requestLocation