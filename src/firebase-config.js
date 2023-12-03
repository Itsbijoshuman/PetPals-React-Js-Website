// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage"; // for uploading images

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyBAQBKOSTceSaSh7HfdiluuPe_NI36foTA",

  authDomain: "project2-afterqouta.firebaseapp.com",

  projectId: "project2-afterqouta",

  storageBucket: "project2-afterqouta.appspot.com",

  messagingSenderId: "747707503687",

  appId: "1:747707503687:web:00103d60b32b84f890cd62"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const storage = getStorage(app); // for uploading images
