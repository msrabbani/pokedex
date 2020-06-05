import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from './screen/HomeScreen.js'
import Explore from './screen/Explore.js'

const Stack = createStackNavigator()

function App() {
  return (
    <NavigationContainer>
     <Stack.Navigator>
       <Stack.Screen name="Home" component={HomeScreen}/>
       <Stack.Screen name="Explore" component={Explore}/>
     </Stack.Navigator>
   </NavigationContainer>
  )
}

export default App

