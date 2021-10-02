import React from 'react';
import Route from './src/routes'
import { useFonts } from 'expo-font'
import { Provider } from 'react-redux'
import store from './src/redux/store'
import { LoadingOverley, ToastSuccess, ToastError} from './src/components/atoms'
import { View } from 'react-native';

const App = () => {
  const [fontsLoaded, error] = useFonts({
    'Poppins-Bold': require('./src/assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('./src/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('./src/assets/fonts/Poppins-SemiBold.ttf'),
    'Neo-Sans-Std-Bold': require('./src/assets/fonts/Neo-Sans-Std-Bold.otf'),
    'Neo-Sans-Std-Light': require('./src/assets/fonts/Neo-Sans-Std-Light.otf'),
    'Neo-Sans-Std-Regular': require('./src/assets/fonts/Neo-Sans-Std-Regular.otf'),
  });

  if(fontsLoaded){
    return (
      <Provider store={store}>
        <Route/>
        <LoadingOverley/>
        <ToastSuccess/>
        <ToastError/>
      </Provider>
    )
  } else {
    return null
  }
}


export default App;