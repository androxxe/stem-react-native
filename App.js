import React from 'react';
import Route from './src/routes'
import { useFonts } from 'expo-font'
import { Provider } from 'react-redux'
import store from './src/redux/store'
import { LoadingOverlay, ToastSuccess, ToastError} from './src/components/atoms'
import { View } from 'react-native';
import OneSignal from 'react-native-onesignal';

const App = () => {
  const [fontsLoaded, error] = useFonts({
    'Poppins-Bold': require('./src/assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('./src/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('./src/assets/fonts/Poppins-SemiBold.ttf'),
    'Neo-Sans-Std-Bold': require('./src/assets/fonts/Neo-Sans-Std-Bold.otf'),
    'Neo-Sans-Std-Light': require('./src/assets/fonts/Neo-Sans-Std-Light.otf'),
    'Neo-Sans-Std-Regular': require('./src/assets/fonts/Neo-Sans-Std-Regular.otf'),
  });

  OneSignal.setLogLevel(6, 0);
  OneSignal.setAppId("cceec050-1355-47a1-a587-e86bde3c676a");
  //END OneSignal Init Code

  //Prompt for push on iOS
  // OneSignal.promptForPushNotificationsWithUserResponse(response => {
  //   console.log("Prompt response:", response);
  // });

  //Method for handling notifications received while app in foreground
  OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
    console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
    let notification = notificationReceivedEvent.getNotification();
    console.log("notification: ", notification);
    const data = notification.additionalData
    console.log("additionalData: ", data);
    // Complete with null means don't show a notification.
    notificationReceivedEvent.complete(notification);
  });

  //Method for handling notifications opened
  OneSignal.setNotificationOpenedHandler(notification => {
    console.log("OneSignal: notification opened:", notification);
  });

  if(fontsLoaded){
    return (
      <Provider store={store}>
        <Route/>
        <LoadingOverlay/>
        <ToastSuccess/>
        <ToastError/>
      </Provider>
    )
  } else {
    return null
  }
}


export default App;