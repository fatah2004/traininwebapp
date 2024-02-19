// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAXZcVb05PKL-FjCTHR02c7S8ly1sfDoYI",
  authDomain: "trainingschool-66096.firebaseapp.com",
  projectId: "trainingschool-66096",
  storageBucket: "trainingschool-66096.appspot.com",
  messagingSenderId: "686501073600",
  appId: "1:686501073600:web:cd825614495aa430fd9325",
  measurementId: "G-FWBQVX1L76"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);


const useAuth = () => {
  return { auth };
};

export { auth,firestore,useAuth };


// apiKey: "AIzaSyAXZcVb05PKL-FjCTHR02c7S8ly1sfDoYI",
// authDomain: "trainingschool-66096.firebaseapp.com",
// projectId: "trainingschool-66096",
// storageBucket: "trainingschool-66096.appspot.com",
// messagingSenderId: "686501073600",
// appId: "1:686501073600:web:cd825614495aa430fd9325",
// measurementId: "G-FWBQVX1L76"