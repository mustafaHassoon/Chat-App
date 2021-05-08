// importing dependencies
import React, { Component } from 'react';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// importing screens
import Start from './components/Start';
import Chat from './components/Chat';



// creating the navigator
const Stack = createStackNavigator();

export default class ChatApp extends Component {
  render() {
    return (
      // Navigation between Start and Chat
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen name="Start" component={Start} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}




// import React, { Component } from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// // import react native gesture handler
// import 'react-native-gesture-handler';

// import Start from './components/Start';
// import Chat from './components/Chat';
// import { createAppContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';



// const navigator = createStackNavigator({
//   Start: { screen: Start },
//   Chat: { screen: Chat }
// });

// const navigatorContainer = createAppContainer(navigator);

// export default navigatorContainer;