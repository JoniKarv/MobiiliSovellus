import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from './Firebase'

export default function Kirjautuminen({navigation}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onLoginPress = () => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((kayttajaTiedot) => {
        const kayttajaId = kayttajaTiedot.user.uid
        const usersRef = firebase.firestore().collection('users')
        usersRef.doc(kayttajaId).get()
          .then(firestoreDocument => {
            if (!firestoreDocument.exists) {
              alert("Käyttäjää ei enää ole.")
              return;
            }
            const kayttaja = firestoreDocument.data()
            navigation.navigate('Media', { Propsit: kayttaja })
          })
          .catch(error => {
            alert(error)
          });
      })
      .catch(error => {
        alert(error)
      })
  }

  const rekisterointiLinkki = () => {
    navigation.navigate('Rekisteroityminen')
  }

  return (
    <View style={styles.container}>
       <KeyboardAwareScrollView>
        <Image style={styles.kuva} source={require('./kuvat/Logo.png')} />
        <View style={styles.ohjeistus}>
          <Text style={styles.otsikko}>Kirjaudu sisään </Text>
        </View>
        <TextInput
          style={styles.tekstiLaatikot}
          placeholder='Sähköposti'
          placeholderTextColor="gray"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.tekstiLaatikot}
          placeholderTextColor="gray"
          secureTextEntry
          placeholder='Salasana'
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.painike}
          onPress={() => onLoginPress()}>
          <Text style={styles.teksti}>Kirjaudu sisään</Text>
        </TouchableOpacity>
        <View style={styles.rekisterointiTeksti}>
          <Text style={styles.teksti2}>Eikö sinulla ole tunnusta? </Text>
          <Text onPress={rekisterointiLinkki} style={styles.tekstiLinkki}>Luo tunnus</Text>
        </View>
        </KeyboardAwareScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
  },
  ohjeistus: {
    flex: 0.25,
    alignItems: 'center',
  },
  otsikko: {
    fontSize: 30,
    color: "black"
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
  rekisterointiTeksti: {
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