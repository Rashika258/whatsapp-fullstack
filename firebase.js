import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDiPJrjd6JRODYvB8C2BIARZgYMuzalGWI",
    authDomain: "whatsapp-ab83b.firebaseapp.com",
    databaseURL: "https://whatsapp-ab83b.firebaseio.com",
    projectId: "whatsapp-ab83b",
    storageBucket: "whatsapp-ab83b.appspot.com",
    messagingSenderId: "235943498104",
    appId: "1:235943498104:web:91539b8f0fbf24e906788d"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();


  export {auth, provider};
  export default db;