
import 'react-native-gesture-handler';
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import KirjauduUlos from './KirjauduUlos'
import Kirjautuminen from './Kirjautuminen'
import Rekisteroityminen from './Rekisteröityminen'
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Media from './Media';
import Lisaa from './Lisaa'
import HaunTulokset from './HaunTulokset'
import { Ionicons } from '@expo/vector-icons' 

const Tab = createBottomTabNavigator();

export default function App(navigation) {
  const piilota = ["Kirjautuminen", "Rekisteroityminen", "HaunTulokset"]
  console.disableYellowBox = true;

  return (
    <NavigationContainer>
    <Tab.Navigator
      screenOptions={({ route  }) => ({ 
        tabBarIcon: ({ focused, color, size }) => { 
          let iconName;
          if (route.name === 'KirjauduUlos') {
            iconName = 'log-out-outline';
          } else if (route.name === 'Media') {
            iconName = 'film-outline';
          } else if (route.name === 'Lisää') {
            iconName = 'add-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarButton:piilota.includes(route.name) ? () => null : undefined,
        tabBarVisible: 
          route.name === "Kirjautuminen" ?
          false :
          route.name === "Rekisteroityminen" ?
          false :
          route.name === "HaunTulokset" ?
          false :
          true
      })}>
      <Tab.Screen name='Media' component={Media}/>
      <Tab.Screen name='Lisää' component={Lisaa}/>
      <Tab.Screen name='KirjauduUlos' component={KirjauduUlos}/>
      <Tab.Screen name="Kirjautuminen" component={Kirjautuminen}/>
      <Tab.Screen name="Rekisteroityminen" component={Rekisteroityminen}/> 
      <Tab.Screen name="HaunTulokset" component={HaunTulokset}/> 
    </Tab.Navigator>
    </NavigationContainer>
    
  );
}

