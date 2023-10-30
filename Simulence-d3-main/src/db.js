// This import loads the firebase namespace.
import firebase from 'firebase';

// D2 Prod deployment, team 38.2. This is meant for D2 prod ONLY
const  firebaseConfig = {
    apiKey: "AIzaSyD0XSKOM85IjHCKRcF_LL2p2hEFLHuoNUY",
    authDomain: "simulence-d2-prod.firebaseapp.com",
    projectId: "simulence-d2-prod",
    storageBucket: "simulence-d2-prod.appspot.com",
    messagingSenderId: "777331901647",
    appId: "1:777331901647:web:de10a0fda7c03f992563ba",
    measurementId: "G-GR9H8PCNED"
};

// PROD deployment
// const firebaseConfig = {
//   apiKey: "AIzaSyCyjqoRaF9Ngg2t5hp0z6hlcUJZhheq9iI",
//   authDomain: "simulence-e7915.firebaseapp.com",
//   databaseURL: "https://simulence-e7915-default-rtdb.firebaseio.com",
//   projectId: "simulence-e7915",
//   storageBucket: "simulence-e7915.appspot.com",
//   messagingSenderId: "1024848792297",
//   appId: "1:1024848792297:web:0913d7454ded98f4b0fe78",
//   measurementId: "G-SPKEG9L0JF"

// };

// QA deployment
// const firebaseConfig = {
//   apiKey: "AIzaSyC4CBlrrTVoYHl6fBvbu4jAxPTWi8D6pXo",
//   authDomain: "simulence-qa23.firebaseapp.com",
//   databaseURL: "https://simulence-qa23-default-rtdb.firebaseio.com",
//   projectId: "simulence-qa23",
//   storageBucket: "simulence-qa23.appspot.com",
//   messagingSenderId: "374320248657",
//   appId: "1:374320248657:web:53693b7ae2cde5e06b8570"
// };


// DEV Deployment
// const firebaseConfig = {
//   apiKey: "AIzaSyDFA546jEgcx4DGaQNxxHJ2MYxiwdk_nw4",
//   authDomain: "simulence-test12.firebaseapp.com",
//   databaseURL: "https://simulence-test12-default-rtdb.firebaseio.com",
//   projectId: "simulence-test12",
//   storageBucket: "simulence-test12.appspot.com",
//   messagingSenderId: "112622526168",
//   appId: "1:112622526168:web:1b683ddd2ebb5c73ed41ad",
//   measurementId: "G-B2C8F1D9XL"
// };

// DEV Deployment (more up-to-date data models Mar 22, 2023)
// const firebaseConfig = {
//   apiKey: "AIzaSyACc9ugGrCzlf5LQXg02U5nIyHWXvThjfs",
//   authDomain: "simulence-test-d2.firebaseapp.com",
//   projectId: "simulence-test-d2",
//   storageBucket: "simulence-test-d2.appspot.com",
//   messagingSenderId: "603097196765",
//   appId: "1:603097196765:web:70e212fe28b6b4909c1334",
//   measurementId: "G-93X26Q29ZD"
// };

// DEV Deployment
// const firebaseConfig = {
//   apiKey: "AIzaSyDFA546jEgcx4DGaQNxxHJ2MYxiwdk_nw4",
//   authDomain: "simulence-test12.firebaseapp.com",
//   databaseURL: "https://simulence-test12-default-rtdb.firebaseio.com",
//   projectId: "simulence-test12",
//   storageBucket: "simulence-test12.appspot.com",
//   messagingSenderId: "112622526168",
//   appId: "1:112622526168:web:1b683ddd2ebb5c73ed41ad",
//   measurementId: "G-B2C8F1D9XL"
// };

// PROD-3 DEPLOYMENT. LEAVE IT THIS WAY ON COMMIT. This is meant for automatic deployment.
// const firebaseConfig = {
//   apiKey: "AIzaSyCoD-uMoTocUk3uk0jXgTSlauLrewztFVo",
//   authDomain: "simulence-prod-3.firebaseapp.com",
//   databaseURL: "https://simulence-prod-3-default-rtdb.firebaseio.com",
//   projectId: "simulence-prod-3",
//   storageBucket: "simulence-prod-3.appspot.com",
//   messagingSenderId: "68819508906",
//   appId: "1:68819508906:web:e66ee5a5033af12ef83ad3"
// };

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebaseConfig.storageBucket