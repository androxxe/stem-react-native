import { useToastErrorDispatch } from '../hooks';
import { setLocation, setStatusPermission, setIsGpsOn, setIsModalEnableGPS, setIsDenied, setLoadingGlobal } from '../redux'
import Geolocation from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid} from 'react-native';

const requestLocation = async ({ dispatch }) => {
    const errorDispatcher = useToastErrorDispatch();
    Geolocation.watchPosition(
        (position) => {
            dispatch(setLocation(position));
            dispatch(setIsGpsOn(true))
            dispatch(setIsModalEnableGPS(false))
        },
        (e) => {
            dispatch(setLocation({}));
            dispatch(setIsGpsOn(false))
            dispatch(setIsDenied(true))
            dispatch(setIsModalEnableGPS(true))
            errorDispatcher(dispatch, e.message)
        }, 
        {
            accuracy: {
                android: 'high',
                ios: 'best',
            },
            enableHighAccuracy: true,
            maximumAge: 10000,
            distanceFilter: 1,
            interval: 10000,
            fastestInterval: 10000,
            forceRequestLocation: true,
            forceLocationManager: false,
            showLocationDialog: true,
        }
    )
}

const watchPosition = () => {
    Geolocation.watchPosition(
        (position) => {
            dispatch(setLocation(position));
            dispatch(setIsGpsOn(true))
            dispatch(setIsModalEnableGPS(false))
        },
        (e) => {
            dispatch(setLocation({}));
            dispatch(setIsGpsOn(false))
            dispatch(setIsDenied(true))
            dispatch(setIsModalEnableGPS(true))
            errorDispatcher(dispatch, e.message)
        },
    )
}

const hasLocationPermission = async ({dispatch}) => {
    const errorDispatcher = useToastErrorDispatch()
    if (Platform.OS === 'android' && Platform.Version < 23) {
        dispatch(setStatusPermission(true))
        return true;
    }

    const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
        dispatch(setStatusPermission(true))
        return true;
    }
    
    const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
        
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
        dispatch(setStatusPermission(true))
        return true;
    }
    
    if (status === PermissionsAndroid.RESULTS.DENIED) {
        dispatch(setStatusPermission(false))
        errorDispatcher(dispatch, 'Perizinan Lokasi tidak diizinkan')
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        dispatch(setStatusPermission(false))
        errorDispatcher(dispatch, 'Perizinan Lokasi tidak diizinkan')
    }

    dispatch(setStatusPermission(false))
    return false;
};

export { requestLocation, hasLocationPermission }