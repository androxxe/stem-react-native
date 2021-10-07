import * as Location from 'expo-location';
import { useToastErrorDispatch } from '../hooks';
import { setLocation, setStatus } from '../redux'

const requestLocation = async ({ dispatch }) => {
    const errorDispatcher = useToastErrorDispatch();
    try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            dispatch(setStatus(false))
            return {
                status
            };
        }

        // let providerStatus = await Location.getProviderStatusAsync()
        // alert(JSON.stringify(providerStatus))
        
        // let location = await Location.getCurrentPositionAsync({
        //     accuracy: 6,
        //     enableHighAccuracy: true 
        // });
        dispatch(setStatus(true))
        // dispatch(setLocation(location))
        return {
            status
        };
    } catch (e) {
        errorDispatcher(dispatch, e.message)
        // alert(JSON.stringify(e.message))
    }
}

export default requestLocation