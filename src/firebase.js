import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtyuLB9eRf5VJO1YaRT76XmWjU9WZK2No",
  authDomain: "iocl-carpool.firebaseapp.com",
  databaseURL: "https://iocl-carpool-default-rtdb.firebaseio.com",
  projectId: "iocl-carpool",
  storageBucket: "iocl-carpool.appspot.com",
  messagingSenderId: "669607643546",
  appId: "1:669607643546:web:b3f79fce5016d89f971223",
  measurementId: "G-36LPWNL1CZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;
