import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyDgktVNJ5wcpzMML8Hj44SULMfpYEnKSlE",
    authDomain: "react-messengerapp.firebaseapp.com",
    databaseURL: "https://react-messengerapp.firebaseio.com",
    projectId: "react-messengerapp",
    storageBucket: "react-messengerapp.appspot.com",
    messagingSenderId: "562969308799",
    appId: "1:562969308799:web:90f0614f9d46c3d3"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase;