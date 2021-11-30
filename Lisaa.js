import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, CheckBox, KeyboardAvoidingView, StyleSheet} from 'react-native';
import { firebase } from './Firebase'
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from "@react-navigation/native";
    
export default function Lisaa() {
  const navigaatio = useNavigation();
  if (firebase.auth().currentUser != null){
  const [medianNimi, setMedianNimi] = useState('');
  const [Elokuvat, setElokuvat] = useState(false);
  const [Sarjat, setSarjat] = useState(false);
  const [Pelit, setPelit] = useState(false);
  const [Kaikki, setKaikki] = useState(true);
  let a = firebase.auth().currentUser;
  const isFocused = useIsFocused();

  useEffect(() => {
    setMedianNimi('')
    setElokuvat(false)
    setSarjat(false)
    setPelit(false)
    setKaikki(true)
  }, [isFocused])

  const Vahvista = () => {
    let Propsit = {
      nimi: medianNimi,
      elokuvat: Elokuvat,
      sarjat: Sarjat,
      pelit: Pelit,
      kaikki: Kaikki
    }
    navigaatio.navigate("HaunTulokset", { Propsit: Propsit })
  }

  const elokuvat = () =>{
    setElokuvat(!Elokuvat)
    setSarjat(false)
    setPelit(false)
    setKaikki(false)
  }

  const sarjat = () =>{
    setElokuvat(false)
    setSarjat(!Sarjat)
    setPelit(false)
    setKaikki(false)
  }

  const pelit = () =>{
    setElokuvat(false)
    setSarjat(false)
    setPelit(!Pelit)
    setKaikki(false)
  }

  const kaikki = () =>{
    setElokuvat(false)
    setSarjat(false)
    setPelit(false)
    setKaikki(!Kaikki)
  }

    return (
          <KeyboardAvoidingView
            behavior="height"
            style={styles.container}
          >
            <View style={styles.flex}></View>
            <View><Text>Etsi mediaa nimellä</Text></View>
            <TextInput
              style={styles.medianNimi}
              placeholder='Median nimi'
              placeholderTextColor="gray"
              onChangeText={(text) => setMedianNimi(text)}
              value={medianNimi}
            />
            <Text style={styles.kategoriat}>Valitse kategoria</Text>
            <View style={styles.checkboxit}>
              <CheckBox
                value={Elokuvat}
                onValueChange={() => elokuvat()}
                style={styles.checkbox}
              />
              <Text style={styles.checkTeksti}>Elokuvat</Text>
              <CheckBox
                value={Sarjat}
                onValueChange={() => sarjat()}
                style={styles.checkbox}
              />
              <Text style={styles.checkTeksti}>Sarjat</Text>
              <CheckBox
                value={Pelit}
                onValueChange={() => pelit()}
                style={styles.checkbox}
              />
              <Text style={styles.checkTeksti}>Pelit</Text>
              <CheckBox
                value={Kaikki}
                onValueChange={() => kaikki()}
                style={styles.checkbox}
              />
              <Text style={styles.checkTeksti}>Kaikki</Text>
            </View>
            <TouchableOpacity
              style={styles.painike}
              onPress={() => Vahvista()}
            >
            <Text style={styles.teksti}>Vahvista</Text>
            </TouchableOpacity>
            <View style={styles.flex}></View>
            </KeyboardAvoidingView>
    );
  }else {
    navigaatio.navigate("Kirjautuminen")
    return(<></>)
  }
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f2f1ed',
      alignItems: 'center',
      justifyContent: 'center',
    },
    flex: {
      flex: 1
    },
    medianNimi: {
      backgroundColor: "white",
      borderRadius: 8,
      borderColor: "#75756f",
      width: 250,
      height: 45,
      marginTop: 15,
      paddingLeft: 10,
    },
    painike: {
      backgroundColor: "#5993de",
      alignItems: "center",
      justifyContent: 'center',
      width: 250,
      height: 45,
      marginTop: 20,
      borderRadius: 8,
    },
    teksti: {
      color: "white"
    },
    checkboxit: {
      marginTop: 10,
      flexDirection: 'row',
    },
    checkbox: {
      alignContent: "center"
    },
    checkTeksti: {
      marginTop: 5
    },
    kategoriat: {
      marginTop: 30
    }
});
  