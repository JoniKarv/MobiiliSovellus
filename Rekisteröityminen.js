import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StyleSheet} from 'react-native';
import {firebase} from './Firebase'

export default function Rekisteroityminen({navigation}) {
  const [sahkoposti, setSahkoposti] = useState('')
  const [salasana, setSalasana] = useState('')
  const [vahvistaSalasana, setVahvistaSalasana] = useState('')

	const Rekisterointi = () => {
    if (salasana !== vahvistaSalasana) {
      alert("Salasanat eivät täsmää.")
      return
    }
    firebase.auth().createUserWithEmailAndPassword(sahkoposti, salasana)
      .then((response) => {
        const uid = response.user.uid
        const kayttaja = {
          id: uid,
          sahkoposti: sahkoposti,
        };
        const usersRef = firebase.firestore().collection('users')
        usersRef.doc(uid).set(kayttaja)
          .then(() => {
            setSahkoposti('')
            setSalasana('')
            setVahvistaSalasana('')
            navigation.navigate('Media', { kayttaja: kayttaja })
          })
          .catch((error) => {
            alert(error)
          });
      })
      .catch((error) => {
        alert(error)
      });
  }

  const KirjautumisLinkki = () => {
    navigation.navigate('Kirjautuminen')
  }

  

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <Image style={styles.kuva} source={require('./kuvat/Logo.png')} />
        <View style={styles.ohjeistus}>
          <Text style={styles.otsikko}>Luo Tunnus </Text>
        </View>
        <TextInput
          style={styles.tekstiLaatikot}
          placeholder='Sähköposti'
          placeholderTextColor="gray"
          onChangeText={(text) => setSahkoposti(text)}
          value={sahkoposti}
        />
        <TextInput
          style={styles.tekstiLaatikot}
          secureTextEntry
          placeholder='Salasana'
          placeholderTextColor="gray"
          onChangeText={(text) => setSalasana(text)}
          value={salasana}
        />
        <TextInput
          style={styles.tekstiLaatikot}
          secureTextEntry
          placeholder='Vahvista salasana'
          placeholderTextColor="gray"
          onChangeText={(text) => setVahvistaSalasana(text)}
          value={vahvistaSalasana}
        />
        <TouchableOpacity
          style={styles.painike}
          onPress={() => Rekisterointi()}>
          <Text style={styles.teksti}>Luo tunnus</Text>
        </TouchableOpacity>
        <View style={styles.kirjautumisTeksti}>
          <Text style={styles.teksti2}>Onko sinulla jo tunnus?</Text>
          <Text onPress={KirjautumisLinkki} style={styles.tekstiLinkki}>Kirjaudu sisään</Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center'
  },
  ohjeistus: {
    flex: 0.25,
    alignItems: 'center',
  },
  otsikko: {
    fontSize: 30,
    color: "black",
  },
  kuva:{
    width: 200,
    height: 150,
    alignSelf: "center",
  },
  tekstiLaatikot: {
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
    fontSize: 15,
    fontWeight: "bold",
    color: 'white',
  },
  kirjautumisTeksti: {
    flex: 1,
    alignItems: "center",
    marginTop: 15
  },
  teksti2: {
    fontSize: 15,
    textAlign: "center",
    color: '#2e2e2d'
  },
  tekstiLinkki: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#5993de",
  }
})