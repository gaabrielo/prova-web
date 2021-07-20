import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyCUsFsvmSf-D_56hm_4jnl8hG8nQAh4pCk",
  authDomain: "prova-web-f4f74.firebaseapp.com",
  databaseURL: "https://prova-web-f4f74-default-rtdb.firebaseio.com",
  projectId: "prova-web-f4f74",
  storageBucket: "prova-web-f4f74.appspot.com",
  messagingSenderId: "394246447467",
  appId: "1:394246447467:web:c2c347419c1a4c70f76c2e",
};
// Initialize Firebase
var database = firebase.initializeApp(firebaseConfig);

export default database.database().ref();
