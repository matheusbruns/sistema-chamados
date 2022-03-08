import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth'; // para usar o modulo de autenticação
import 'firebase/storage'; // para enviar arquivos

const firebaseConfig = {
  apiKey: "AIzaSyCrIEV86qrcwDedxRZsYGOXFoUtvnB5aQA",
  authDomain: "sistema-chamados-e4122.firebaseapp.com",
  projectId: "sistema-chamados-e4122",
  storageBucket: "sistema-chamados-e4122.appspot.com",
  messagingSenderId: "26689848511",
  appId: "1:26689848511:web:7fc1f79f28254a46c6b20a",
  measurementId: "G-PR6G5EQF5S"
};

if(!firebase.apps.length){
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}

export default firebase