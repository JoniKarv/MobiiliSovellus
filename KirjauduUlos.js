import React, {useEffect} from 'react';
import { View } from 'react-native';
import { firebase } from './Firebase'
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from "@react-navigation/native";
    
export default function KirjauduUlos (props) {
  const navigaatio = useNavigation();
  firebase.auth().signOut()
  const isFocused = useIsFocused();
  useEffect(() => {
    firebase.auth().signOut().then(() => {
      console.log("onnistui")
      navigaatio.navigate("Kirjautuminen")
    }).catch((error) => {
      console.log("ei onnistunut")
    });
  }, [isFocused])

  return (
    <View>
    </View>
  );
}
