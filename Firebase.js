import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDhGMjGHBuO2npmaGQfFzne8cO3L29JIgY",
    authDomain: "elokuvasovellus.firebaseapp.com",
    projectId: "elokuvasovellus",
    storageBucket: "elokuvasovellus.appspot.com",
    messagingSenderId: "862994240962",
    appId: "1:862994240962:web:74e9250193f845aa1c325b"
  };

firebase.initializeApp(firebaseConfig);


export { firebase };