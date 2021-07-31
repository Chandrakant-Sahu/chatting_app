import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtlYzrrG5T4vPY91GzBfK0VsuiU3UvpQw",
  authDomain: "whatsapp-clone-2468.firebaseapp.com",
  projectId: "whatsapp-clone-2468",
  storageBucket: "whatsapp-clone-2468.appspot.com",
  messagingSenderId: "577919537269",
  appId: "1:577919537269:web:b4f9d56c0f3b60bb44283c",
  measurementId: "G-0P2234RSQM",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export default db;
export { auth, provider };




