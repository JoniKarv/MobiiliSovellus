import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Text, View, Image, CheckBox, Dimensions} from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SearchBar } from 'react-native-elements';
import { firebase } from './Firebase'
import { useNavigation } from '@react-navigation/native';
import Swipeout from 'react-native-swipeout';
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons' 

export default function Media() {
  const navigaatio = useNavigation();
  if (firebase.auth().currentUser != null){
  let a = firebase.auth().currentUser;
  const [valitutElokuvat, setValitutElokuvat] = useState([]);
  const [firebaseValitutElokuvat, setFirebaseValitutElokuvat] = useState([])
  const [haku, setHaku] = useState();
  const [paivita, setPaivita] = useState(false);
  const [data, setData] = useState([]);
  const [idLista, setIdLista] = useState([]);
  const [lataaUudestaan, setLataaUudestaan] = useState(false);
  const [haettu, setHaettu] = useState([])
  const isFocused = useIsFocused();
  const [arvostelu, setArvostelu] = useState();
  const [sulje, setSulje] = useState(false);
  const rating = 0

  useEffect(() => {
    let mounted = true;
    const Hae = async () => {
      //Tähän tallennetaan data
      let lista = [];
      //Document ID:t poistamista varten
      let IDt = [];
      //Checkboxien täpät
      let katsotut = [];
      let snapshot = await firebase.firestore().collection("media").orderBy("Title").get()
      let id = firebase.auth().currentUser.uid
      let i = 0
      snapshot.forEach((doc) => {
        if (doc.data().userId == id){
          IDt.push(doc.id)
          lista.push(doc.data())
          if (doc.data().Katsottu){
            katsotut.push(i)
          }
          i = i + 1
        }
      })
      if (katsotut.length > 0){
        setFirebaseValitutElokuvat(katsotut)
        setValitutElokuvat(katsotut)
      }
      setData(lista)
      setHaettu(lista)
      setIdLista(IDt)
    }
    Hae()
    return () => {
      mounted = false;
    }
  }, [isFocused, lataaUudestaan])

  const Poista = async (index) => {
    let id = idLista[index]
    firebase.firestore().collection('media').doc(id).delete()
    setLataaUudestaan(!lataaUudestaan)
  }

  const hakuFunktio = (teksti) => {
    if (teksti.length > 0) {
      const uusiData = data.filter(function (item) {
        const itemData = item.Title
          ? item.Title.toUpperCase()
          : ''.toUpperCase();
        const tekstinData = teksti.toUpperCase();
        return itemData.indexOf(tekstinData) > -1;
      });
      setHaettu(uusiData);
      setHaku(teksti);
    } else {
      setHaettu(data);
      setHaku(teksti);
    }
  };

  const paivitaCheckbox =  async (index) => {
    lisaaValinta(index)
    let id = idLista[index]
    let TvaiF = ''
      if (data[index].Katsottu){
        TvaiF = false
      } else {
        TvaiF = true
      }
    await firebase.firestore().collection('media').doc(id).update({
      Katsottu: TvaiF
    })
    .then(() => {
      console.log('Tiedot päivitetty');
    })
    setLataaUudestaan(!lataaUudestaan)
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
      let lista = valitutElokuvat.slice()
      lista.splice(indeksi, 1)
      setValitutElokuvat(lista)
    }else{
      let lista = valitutElokuvat.slice()
      lista.push(index)
      setValitutElokuvat(lista)
    }
    setPaivita(!paivita)
  }

  const Arvostele = (index) => {
    setArvostelu(index)
    setSulje(true)
  }

  const Arvosteltu = (index, rating) =>{
    let id = idLista[index]
    console.log(rating)
    firebase.firestore().collection('media').doc(id).update({
      Arvostelu: rating
    })
    .then(() => {
      console.log('Tiedot päivitetty');
    })
    setLataaUudestaan(!lataaUudestaan)
    setArvostelu()
    setSulje(false)
    rating = 0
  }

  const renderoija = ({ item, index }) => {
    let checkbox = false;
    let i = valitutElokuvat.length;
    while (i--) {
       if (valitutElokuvat[i] === index) {
        checkbox = true
       }
    }
    let swipeBtns = [
      {
        text: <Ionicons name="star-half-outline" size={30} color={"yellow"}/>,
        backgroundColor: '#adadad',
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => { Arvostele(index) }
       },
      {
        text: <Ionicons name={"trash-outline"} size={30} color={"black"}/>,
        backgroundColor: '#adadad',
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => { Poista(index) }
     },
     
    ];
    return (
      <Swipeout right={swipeBtns}
        close={sulje}
        disabled={sulje}
        backgroundColor= 'transparent'>
        <View style={styles.container2}>
        <Image style={styles.kuva}
          source={{
            uri:
              item.Poster
          }} />  
        {arvostelu == index ?
        <View style={{width: "70%", alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{marginBottom: 15, fontWeight: "bold"}}>Arvostele</Text>
          <AirbnbRating
            default={rating}
            type='star'
            defaultRating={0}
            ratingCount={5}
            imageSize={40}
            showRating={false}
            tintColor="#D0D1CF"
            onFinishRating={(rating) => {Arvosteltu(index, rating)}}
          />
        </View>
        :
        <>
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
            <Text style={styles.vuosi}>
              Arvostelu: 
              {item.Arvostelu == "" ?
              <Text> N/A</Text>
              :
              <Text> {item.Arvostelu}</Text>
              }
              
            </Text>
            <View style={{flexDirection: "row"}}>
            <Text style={styles.CheckBoxTeksti}>{item.Type == "game" ? "Pelattu" : "Katsottu"}</Text>
            <CheckBox
              value={checkbox}
              onValueChange={() => paivitaCheckbox(index)}
              style={styles.checkbox}
            />
          </View>
          </View>
          </>
        }
        </View>
      </Swipeout>
    );
  }

  return (
    
    <View style = {styles.container}>
      {data.length > 0 ? 
      <>
      <View style={styles.flatlist}>
        <FlatList
          data={haettu}
          renderItem={renderoija}
          keyExtractor={item => item.id}
          extraData={paivita}
        />
        </View>
        <View style={styles.haku}>
          <KeyboardAwareScrollView>
        <SearchBar
          round searchIcon={{ size: 24 }}
          onChangeText={(teksti) => hakuFunktio(teksti)}
          onClear={(teksti) => hakuFunktio('')}
          placeholder="Etsi kokoelmasta..."
          value={haku}
        />
        </KeyboardAwareScrollView>
        </View>
        </>
        : <>
        <View style={styles.flex}></View>
        <View style={styles.flex}>
          <Ionicons name="search-outline" size={100}></Ionicons>
          <Text>Näyttäisi että kokoelmasi on tyhjä</Text>
          <Text>Navigoi "lisää" välilehdelle lisääksesi mediaa kokoelmaasi</Text>
        </View>
        <View style={styles.flex}></View>
        </>}
      </View>
  );
  }else {
    navigaatio.navigate("Kirjautuminen")
    return(<></>)
  }
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "#D0D1CF",
  },
  flatlist: {
    flex: 4,
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paivitys: {
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "#9cc7ff",
    alignItems: "center",
    justifyContent: 'center',
  },
  haku: {
    flex: 0.45,
    width: "100%",
  },
//------------------------------------------------
//RenderItem tyylit
  container2: {
    paddingTop: 10,
    width: Dimensions.get('screen').width,
    flex: 1,
    alignContent: "center",
    flexDirection: 'row',
  },
  arvosteluContainer: {
    paddingTop: 10,
    width: Dimensions.get('screen').width,
    flex: 1,
    alignContent: "center",
    justifyContent: 'center',
  },
  arvostelu: {
    alignItems: 'flex-start'
  },
  kuva: {
    width: "25%",
    height: 100,
    alignSelf: 'center',
    marginLeft: 15,
    borderRadius: 5,
  },
  teksti2: {
    flex: 1,
    flexDirection: 'column',
    height: 80,
    width: '80%',
    marginLeft: 10,
    marginTop: 8,
    marginBottom: 8,
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
    width: '80%',
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



//Testidataa jos API ja/tai Firebaseen ei saa yhteyttä
 /* let data = [
    {
      Poster: "https://m.media-amazon.com/images/M/MV5BMTYwOTEwNjAzMl5BMl5BanBnXkFtZTcwODc5MTUwMw@@._V1_SX300.jpg",
      Title: "Avatar",
      Type: "movie",
      Year: "2009",
      imdbID: "tt0499549",
    },
    {
      Poster: "https://m.media-amazon.com/images/M/MV5BODc5YTBhMTItMjhkNi00ZTIxLWI0YjAtNTZmOTY0YjRlZGQ0XkEyXkFqcGdeQXVyODUwNjEzMzg@._V1_SX300.jpg",
      Title: "Avatar: The Last Airbender",
      Type: "series",
      Year: "2005–2008",
      imdbID: "tt0417299",
    },
    {
      Title: "Avatar: The Game",
      Year: "2009",
      imdbID: "tt1517155",
      Type: "game",
      Poster: "https://m.media-amazon.com/images/M/MV5BMTYxODI2OTI4MF5BMl5BanBnXkFtZTcwNjI1NzMwMw@@._V1_SX300.jpg"
    },
    {
      Title: "Avatar: The Last Airbender - Into the Inferno",
      Year: "2008",
      imdbID: "tt1459460",
      Type: "game",
      Poster: "https://m.media-amazon.com/images/M/MV5BOWFjYWUwZTMtNjM2Mi00YjU3LWI2NjQtZTNhOTRhM2Q3YmJkXkEyXkFqcGdeQXVyMzM4MjM0Nzg@._V1_SX300.jpg"
    },
    {
      Title: "Avatar: The Last Airbender - The Burning Earth",
      Year: "2007",
      imdbID: "tt1459461",
      Type: "game",
      Poster: "https://m.media-amazon.com/images/M/MV5BM2M5N2FkY2EtMTJmMy00NjdmLWEwYmEtYjljOWI0MjQ1M2MyXkEyXkFqcGdeQXVyMzM4MjM0Nzg@._V1_SX300.jpg"
    },
    {
      Title: "Avatar Spirits",
      Year: "2010",
      imdbID: "tt1900832",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BMzQ4MDMxNjExNl5BMl5BanBnXkFtZTgwOTYzODI5NTE@._V1_SX300.jpg"
    },
    {
      Title: "Avatar: The Last Airbender - The Legend of Aang",
      Year: "2006",
      imdbID: "tt0959552",
      Type: "game",
      Poster: "https://m.media-amazon.com/images/M/MV5BNjUwNzA5Nzc4N15BMl5BanBnXkFtZTgwNjM1ODY4MDE@._V1_SX300.jpg"
    },
    {
      Title: "The King's Avatar",
      Year: "2017–",
      imdbID: "tt6859260",
      Type: "series",
      Poster: "https://m.media-amazon.com/images/M/MV5BZjIyMjE5ZDYtMTQxNC00NTEzLTgwYzYtMmM0NDg3OWFlYWM5XkEyXkFqcGdeQXVyNjMxNzQ2NTQ@._V1_SX300.jpg"
    },
    {
      Title: "The King's Avatar",
      Year: "2019",
      imdbID: "tt10732794",
      Type: "series",
      Poster: "https://m.media-amazon.com/images/M/MV5BOGMxZDc1N2ItODI3NS00MDIwLWJkYzAtMTgyMDZlN2FlNGYzXkEyXkFqcGdeQXVyMjQ0OTYxOTc@._V1_SX300.jpg"
    },
  ]

  Metodi checkboxien päivittäminen tietokantaan jos täpistä tulee liikaa pyyntöjä
  
  const PaivitaKatsotut = () => {
    let i = 0
    let lista4 = []
    if (firebaseValitutElokuvat.length == 0 && valitutElokuvat.length > 0){
      lista4 = valitutElokuvat.slice()
    } else if (valitutElokuvat.length == 0 && firebaseValitutElokuvat.length > 0){
      lista4 = firebaseValitutElokuvat.slice()
    }
    else {
      let lista1 = firebaseValitutElokuvat.slice()
      let lista2 = valitutElokuvat.slice()
      let lista3 = lista1.filter(item => (lista2.includes(item)))
      lista4 = []
      let j = 0
      let onko = false
      while (i < lista1.length) {
        while (j < lista3.length) {
          if (lista1[i] == lista3[j]) {
            onko = true
          }
          j = j + 1
        }
        if (!onko) {
          lista4.push(lista1[i])
        }
        onko = false
        j = 0
        i = i + 1
      }
      onko = false
      j = 0
      i = 0
      while (i < lista2.length) {
        while (j < lista3.length) {
          if (lista2[i] == lista3[j]) {
            onko = true
          }
          j = j + 1
        }
        if (!onko) {
          lista4.push(lista2[i])
        }
        onko = false
        i = i + 1
        j = 0
      }
    } 
    i = 0
    let id = 0
    while (i < lista4.length){  
      id = idLista[lista4[i]]
      let TvaiF = ''
      if (data[lista4[i]].Katsottu){
        TvaiF = false
      } else {
        TvaiF = true
      }
      firebase.firestore().collection('media').doc(id).update({
        Katsottu: TvaiF,
      })
      .then(() => {
        console.log('Tiedot päivitetty');
      })
       i = i + 1
    }
    setLataaUudestaan(!lataaUudestaan)
  }
  */