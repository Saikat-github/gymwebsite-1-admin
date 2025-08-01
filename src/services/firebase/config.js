import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";


import conf from "../../conf/conf";


const firebaseConfig = {
  apiKey: conf.firebaseApiKey ,
  authDomain: conf.firebaseAuthDomain ,
  projectId: conf.firebaseProjectId,
  storageBucket: conf.firebaseStorageBucket,
  messagingSenderId: conf.firebaseMessagingSenderId,
  appId: conf.firebaseAppId,
  databaseURL: conf.firebaseDatabaseUrl,
  measurementId: conf.firebaseMeasurementId 
};


export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app); 