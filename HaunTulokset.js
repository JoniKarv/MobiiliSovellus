import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList,  CheckBox, Image, Text, View, TouchableOpacity, Dimensions} from 'react-native';
import { firebase } from './Firebase'
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons' 

export default function HaunTulokset(props) {
  const navigaatio = useNavigation();
  if (firebase.auth().currentUser != null){
  const [valitutElokuvat, setValitutElokuvat] = useState([]);
  let { route } = props
  let { Propsit } = route.params
  let propsit = Propsit
  console.log(propsit)
  const [tiedot, setTiedot] = useState([]);
  const [paivita, setPaivita] = useState(false);
  let url = 'https://www.omdbapi.com/?apikey=4f1e70ac&s='
  let APIhaku = url + propsit.nimi
  const isFocused = useIsFocused();

  useEffect(() => {
    if (propsit.elokuvat){
      APIhaku = APIhaku + "&type=movie"
    } else if (propsit.sarjat){
      APIhaku = APIhaku + "&type=series"
    } else if (propsit.pelit){
      APIhaku = APIhaku + "&type=game"
    }
    let mounted = true;
    const haku = async () => {
      try {
        let response = await fetch(APIhaku)
        let haku = await response.json()
        if (mounted)
          if (haku.Response != "False"){
            setTiedot(haku)
          }
      } catch (error) {
        console.log("ERROR FETCHISSÄ", error)
      }
    }
    haku()
    return () => {
      mounted = false;
    }
  }, [isFocused])

  const Takaisin = () => {
    setTiedot([])
    navigaatio.navigate("Lisää")
  }

  const Tallenna = () => {
    console.log(tiedot.Search)
    let i = 0
    while (i < valitutElokuvat.length){
      let Elokuva = tiedot.Search[valitutElokuvat[i]]
      firebase.firestore().collection("media")
        .add({
          Title: Elokuva.Title,
          Year: Elokuva.Year,
          Type: Elokuva.Type,
          Poster: Elokuva.Poster,
          Arvostelu: "",
          Katsottu: false,
          userId: firebase.auth().currentUser.uid
        })
        .catch((error) => console.log(error))
      i = i + 1
    }
    setValitutElokuvat([])
    navigaatio.navigate("Lisää")
  }

  const lisaaValinta = (index) => {
    let onko = false
    let indeksi = 0
    let i = valitutElokuvat.length;
    while (i--) {
       if (valitutElokuvat[i] === index) {
          indeksi = i
          onko = true
       }
    }
    if (onko){
      let lista = valitutElokuvat
      lista.splice(indeksi, 1)
      setValitutElokuvat(lista)
    }else{
      let lista = valitutElokuvat
      lista.push(index)
      setValitutElokuvat(lista)
    }
    setPaivita(!paivita)
  }

    const renderoija = ({ item, index }) => {
      let checkbox = false;
      let i = valitutElokuvat.length;
      while (i--) {
        if (valitutElokuvat[i] === index) {
          checkbox = true
        }
      }
      return (
        <View style={styles.container2}>
          <Image style={styles.kuva}
            source={{
              uri:
                item.Poster
            }} />
          <View style={styles.teksti2}>
            <Text
              style={styles.nimi}>
              {item.Title}
            </Text>
            <Text style={{ alignItems: 'flex-end' }}>
              Kategoria: {item.Type}
            </Text>
          </View>
          <View style={styles.teksti3}>
            <Text style={styles.vuosi}>
              {item.Year}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.CheckBoxTeksti}>Valitse</Text>
              <CheckBox
                value={checkbox}
                onValueChange={() => lisaaValinta(index)}
                style={styles.checkbox}
              />
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {console.log(tiedot[0])}
        {tiedot.length == 0 ? <>
        <View style={styles.flex}></View>
        <View style={styles.flex}>
          <Ionicons name="search-outline" size={100}></Ionicons>
          <Text>Haullasi ei löytynyt elokuvia</Text>
          <Text>Valitse "takaisin" ja tarkenna hakuasi</Text>
        </View>
        <View style={styles.flex}></View>
        </>
        : 
        <>
        <View style={styles.otsikko}>
          <Text style={styles.otsikonTeksti}>Valitse lisättävä media</Text>
        </View>
        <View style={styles.flatlist}>
          <FlatList
            data={tiedot.Search}
            renderItem={renderoija}
            keyExtractor={item => item.id}
            extraData={paivita}
          />
        </View>
        </>}
        <View style={styles.valinnat}>
        <TouchableOpacity
          style={styles.painike}
          onPress={() => Takaisin()}
        >
          <Text style={styles.teksti}>Takaisin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.painike}
          onPress={() => Tallenna()}
        >
          <Text style={styles.teksti}>Tallenna valinnat</Text>
        </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    navigaatio.navigate("Kirjautuminen")
    return (<></>)
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  flex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otsikko: {
    flex: 0.3,
    backgroundColor: "#D0D1CF",
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: "black",
    marginBottom: 2

  },
  otsikonTeksti: {
    fontSize: 15,
    fontWeight: '200',
    marginBottom: 4,
    color: 'black',
    fontWeight: "bold"
  },
  valinnat: {
    flex: 0.3,
    backgroundColor: "#D0D1CF",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
  },
  painike: {
    backgroundColor: "#9cc7ff",
    alignItems: "center",
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: "black",
    marginRight: 1,
    marginLeft: 1,
    width: Dimensions.get('screen').width * 0.48,
    height: 45,
    borderRadius: 10,
  },
  teksti: {
    color: "black"
  },
  flatlist: {
    flex: 4,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
//-----------------------------
//RenderItem tyylit
  container2: {
    width: Dimensions.get('screen').width,
    marginTop: 2,
    marginBottom: 2,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#D0D1CF',
  },
  kuva: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginLeft: 15,
    borderRadius: 5,
  },
  teksti2: {
    flex: 1,
    flexDirection: 'column',
    height: 80,
    width: '70%',
    marginHorizontal: 10,
    marginVertical: 8,
  },
  nimi: {
    flex: 1,
    fontSize: 15,
    fontWeight: '200',
    marginBottom: 4,
    color: 'black',
  },
  teksti3: {
      flex: 1,
      height: 80,
      width: '70%',
      marginHorizontal: 20,
      marginVertical: 10,
      flexDirection: 'column',
      alignItems: 'flex-end',
  },
  vuosi: {
    flex: 1,
    marginBottom: 4,
    fontSize: 15,
    fontWeight: '100',
  },
  checkbox: {
    alignItems: 'flex-end',
    color: '#808080',
  },
  CheckBoxTeksti: {
    marginTop: 5
  }
});
